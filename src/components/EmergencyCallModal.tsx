import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  UserPlus,
  Users,
  ShieldAlert,
  HeartPulse,
  Stethoscope,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  AlertCircle
} from 'lucide-react';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  category: 'doctor' | 'family' | 'helpline' | 'custom';
  source?: 'device' | 'manual' | 'preset';
}

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'aurahealth_emergency_contacts_v1';

const DEFAULT_HELPLINES: EmergencyContact[] = [
  {
    id: 'hl_national',
    name: 'National Emergency Helpline',
    phone: '112',
    relation: 'Police, Fire & All Emergencies',
    category: 'helpline',
    source: 'preset'
  },
  {
    id: 'hl_ambulance',
    name: 'Medical Emergency & Ambulance',
    phone: '108',
    relation: 'Immediate Medical First Response',
    category: 'helpline',
    source: 'preset'
  },
  {
    id: 'hl_mental_health',
    name: 'Tele-MANAS Youth & Mental Health',
    phone: '14416',
    relation: '24/7 Psychological & Crisis Support',
    category: 'helpline',
    source: 'preset'
  },
  {
    id: 'hl_health_advisory',
    name: 'National Health Toll-Free Advisory',
    phone: '1075',
    relation: 'Medical Consultations & Outbreak Helpline',
    category: 'helpline',
    source: 'preset'
  }
];

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load contacts from storage:', e);
    }
    return [
      {
        id: 'c_dr_verma',
        name: 'Dr. Neha Verma (General Physician)',
        phone: '+919876543210',
        relation: 'Primary Care Physician',
        category: 'doctor',
        source: 'manual'
      },
      {
        id: 'c_family_ice',
        name: 'Home / Guardian (Emergency ICE)',
        phone: '+919812345678',
        relation: 'Primary Family Contact',
        category: 'family',
        source: 'manual'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'contacts' | 'helplines' | 'dialer'>('contacts');
  const [customNumber, setCustomNumber] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family / Friend');
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check if browser supports the native Contact Picker API
  const isContactPickerSupported =
    typeof window !== 'undefined' &&
    'contacts' in navigator &&
    'ContactsManager' in window;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts:', e);
    }
  }, [contacts]);

  if (!isOpen) return null;

  // Trigger Native Phone Contacts App
  const handleConnectPhoneContacts = async () => {
    setStatusMessage(null);

    // If native Contact Picker is available in this browser
    if (isContactPickerSupported) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        // Request access to device phone contacts app
        const selectedContacts = await (navigator as any).contacts.select(props, opts);

        if (selectedContacts && selectedContacts.length > 0) {
          const formatted: EmergencyContact[] = selectedContacts.map((c: any, idx: number) => {
            const rawPhone = Array.isArray(c.tel) ? c.tel[0] : c.tel || '';
            const rawName = Array.isArray(c.name) ? c.name[0] : c.name || 'Phone Contact';
            return {
              id: `dev_${Date.now()}_${idx}`,
              name: rawName,
              phone: rawPhone.replace(/\s+/g, ''),
              relation: 'Phonebook Contact',
              category: 'custom' as const,
              source: 'device' as const,
            };
          }).filter((c: EmergencyContact) => c.phone);

          if (formatted.length > 0) {
            setContacts((prev) => [...formatted, ...prev]);
            setStatusMessage(`✓ Successfully imported ${formatted.length} contact(s) from your phonebook!`);
            setTimeout(() => setStatusMessage(null), 4000);
            return;
          }
        }
      } catch (err: any) {
        console.warn('Contact picker cancelled or failed:', err);
      }
    }

    // Fallback if desktop or contact picker not permitted: open quick entry form
    setShowAddForm(true);
    setStatusMessage('Device contact picker opened. Enter contact details below to link with 1-click calling.');
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleAddManualContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: `usr_${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation,
      category: newContactRelation.toLowerCase().includes('doctor') ? 'doctor' : 'family',
      source: 'manual'
    };

    setContacts([newContact, ...contacts]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddForm(false);
    setStatusMessage(`✓ Added ${newContact.name} to quick calling list.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleInitiateCall = (phone: string, name: string) => {
    // Initiate direct telephone dialer protocol
    const sanitized = phone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${sanitized}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white flex items-center justify-between border-b border-rose-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Emergency & Medical Calling Hub
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  DIRECT CALL
                </span>
              </div>
              <span className="text-xs text-slate-300">
                1-tap calling for emergency services, physicians, and phone contacts
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'contacts'
                ? 'border-rose-600 text-rose-950 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Contacts ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'helplines'
                ? 'border-rose-600 text-rose-950 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Helplines</span>
          </button>

          <button
            onClick={() => setActiveTab('dialer')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'dialer'
                ? 'border-rose-600 text-rose-950 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Dial Pad</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: Personal Phone & Care Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {/* Connect Device Contacts Bar */}
              <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Connect Phone Contacts App
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Sync emergency contacts directly from your Android / iPhone phonebook.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleConnectPhoneContacts}
                    className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Sync Phone Contacts</span>
                  </button>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    title="Add Contact Manually"
                  >
                    <UserPlus className="w-4 h-4 text-teal-700" />
                  </button>
                </div>
              </div>

              {/* Add Contact Manual Drawer */}
              {showAddForm && (
                <form
                  onSubmit={handleAddManualContact}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fade-in"
                >
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-slate-900">Add New Calling Contact</span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Patel / Mom"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      value={newContactRelation}
                      onChange={(e) => setNewContactRelation(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium"
                    >
                      <option value="Primary Care Physician">Primary Care Physician</option>
                      <option value="Family / Guardian (ICE)">Family / Guardian (ICE)</option>
                      <option value="Campus Health Center">Campus Health Center</option>
                      <option value="Cardiologist / Specialist">Cardiologist / Specialist</option>
                      <option value="Emergency Contact">Emergency Contact</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Save Contact
                    </button>
                  </div>
                </form>
              )}

              {/* Contact Cards List */}
              <div className="space-y-2.5">
                {contacts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No contacts saved yet. Tap "Sync Phone Contacts" or "+" to link family and physicians.
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            contact.category === 'doctor'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {contact.category === 'doctor' ? (
                            <Stethoscope className="w-5 h-5" />
                          ) : (
                            <HeartPulse className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {contact.name}
                            </h4>
                            {contact.source === 'device' && (
                              <span className="text-[9px] font-mono px-1 rounded bg-slate-100 text-slate-500 shrink-0">
                                Phonebook
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {contact.relation} · <strong className="font-mono text-slate-700">{contact.phone}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Call Button */}
                        <a
                          href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                          onClick={() => handleInitiateCall(contact.phone, contact.name)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          title="Remove from quick calling"
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Emergency Helplines */}
          {activeTab === 'helplines' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Immediate toll-free government and medical assistance helplines available 24/7.
                </span>
              </div>

              <div className="space-y-2.5">
                {DEFAULT_HELPLINES.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-rose-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {hl.phone}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{hl.name}</h4>
                        <span className="text-[11px] text-slate-500">{hl.relation}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${hl.phone}`}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {hl.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Quick Dial Pad */}
          {activeTab === 'dialer' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Direct In-App Phone Dialer
                </span>

                <div className="relative max-w-xs mx-auto">
                  <input
                    type="tel"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full text-center text-lg font-mono font-bold py-2.5 px-4 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => setCustomNumber((prev) => prev + digit)}
                      className="py-2.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-mono font-bold text-sm text-slate-800 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <a
                    href={`tel:${customNumber.replace(/[^\d+*#]/g, '')}`}
                    className={`px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 ${
                      !customNumber ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Dial Number</span>
                  </a>

                  {customNumber && (
                    <button
                      type="button"
                      onClick={() => setCustomNumber('')}
                      className="px-3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
