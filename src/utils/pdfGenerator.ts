import jsPDF from 'jspdf';
import { MedicalReport, UserProfile } from '../types/index.ts';

export function generateReportPDF(report: MedicalReport, userProfile?: UserProfile | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
      // Add subtle header on continuation pages
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 160);
      doc.text(`AuraHealth Clinical Record — ${report.title}`, margin, 10);
      doc.text(`Date: ${report.reportDate}`, pageWidth - margin - 30, 10);
      doc.setDrawColor(220, 230, 235);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 118, 110); // Teal 700
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AURAHEALTH CLINICAL SUMMARY', margin + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(204, 251, 241); // Teal 100
  doc.text('Patient Laboratory Biomarkers & Clinical Discussion Record', margin + 6, y + 17);

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  doc.setFontSize(8);
  doc.text(`Exported: ${nowFormatted}`, pageWidth - margin - 35, y + 17);

  y += 30;

  // Patient & Report Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT TITLE:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.title.slice(0, 50), margin + 34, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TEST DATE:', margin + 4, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.reportDate, margin + 34, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SOURCE FILE:', margin + 4, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.fileName, margin + 34, y + 20);

  if (userProfile) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('PATIENT:', margin + 105, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${userProfile.name} (${userProfile.age}y, ${userProfile.gender})`, margin + 125, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('LIFESTYLE:', margin + 105, y + 13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(userProfile.lifestyle.replace('_', ' ').toUpperCase(), margin + 125, y + 13);
  }

  y += 32;

  // Plain Language Summary Section
  checkPageBreak(30);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('Clinical Synthesis & Summary', margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.summary, contentWidth - 4);
  doc.text(summaryLines, margin + 2, y);
  y += summaryLines.length * 4.5 + 6;

  // Biomarkers Table Header
  checkPageBreak(35);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`Biomarkers & Test Results (${report.parameters.length})`, margin, y);
  y += 6;

  // Table Columns Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('BIOMARKER', margin + 3, y + 5.5);
  doc.text('RESULT', margin + 55, y + 5.5);
  doc.text('REF. RANGE', margin + 85, y + 5.5);
  doc.text('STATUS', margin + 118, y + 5.5);
  doc.text('CLINICAL NOTE', margin + 145, y + 5.5);
  y += 10;

  // Table Rows
  report.parameters.forEach((param) => {
    checkPageBreak(16);

    const isAbnormal = param.status === 'low' || param.status === 'high';

    if (isAbnormal) {
      doc.setFillColor(255, 241, 242); // Rose 50
      doc.rect(margin, y - 2, contentWidth, 12, 'F');
    }

    doc.setFontSize(8.5);
    doc.setFont('helvetica', isAbnormal ? 'bold' : 'normal');
    doc.setTextColor(isAbnormal ? 190 : 15, isAbnormal ? 18 : 23, isAbnormal ? 60 : 42);
    doc.text(param.parameterName.slice(0, 26), margin + 3, y + 3);

    doc.setFont('helvetica', 'bold');
    doc.text(`${param.value} ${param.unit}`, margin + 55, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const rangeText = param.referenceMin !== undefined && param.referenceMax !== undefined
      ? `${param.referenceMin} - ${param.referenceMax}`
      : 'Standard';
    doc.text(rangeText, margin + 85, y + 3);

    // Status pill
    if (param.status === 'optimal') {
      doc.setTextColor(5, 150, 105);
      doc.text('NORMAL', margin + 118, y + 3);
    } else if (param.status === 'low') {
      doc.setTextColor(225, 29, 72);
      doc.text('LOW', margin + 118, y + 3);
    } else if (param.status === 'high') {
      doc.setTextColor(225, 29, 72);
      doc.text('HIGH', margin + 118, y + 3);
    } else {
      doc.setTextColor(217, 119, 6);
      doc.text('BORDERLINE', margin + 118, y + 3);
    }

    // Short explanation
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    const note = (param.plainExplanation || '').slice(0, 32);
    doc.text(note, margin + 145, y + 3);

    // Subtle divider
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    y += 12;
  });

  y += 4;

  // Doctor Discussion Points
  if (report.doctorDiscussionPoints && report.doctorDiscussionPoints.length > 0) {
    checkPageBreak(35);
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, y, contentWidth, 8 + report.doctorDiscussionPoints.length * 6, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(49, 46, 129);
    doc.text('Questions for Your Clinician / Doctor Consultation', margin + 4, y + 6);
    y += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(67, 56, 202);
    report.doctorDiscussionPoints.forEach((point) => {
      doc.text(`• ${point}`, margin + 6, y);
      y += 5.5;
    });
    y += 6;
  }

  // Footer Disclaimer
  checkPageBreak(25);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const disclaimer = 'NOTICE: This document is an informational export generated by AuraHealth for patient personal review and clinician reference. It is not an official diagnostic certificate. Lab reference ranges vary by testing instrument. Please consult a licensed medical practitioner for clinical management.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  // Save the PDF
  const sanitizedTitle = (report.title || 'Medical_Report').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `AuraHealth_${sanitizedTitle}_${report.reportDate || 'record'}.pdf`;
  doc.save(fileName);
}
