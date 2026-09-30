import React, { useState } from 'react';
import { BookOpen, X, Sparkles, ExternalLink, Bookmark, Search } from 'lucide-react';
import { HealthStory } from '../types/index.ts';

interface HealthLibraryProps {
  stories: HealthStory[];
  initialStoryId?: string;
}

export const HealthLibrary: React.FC<HealthLibraryProps> = ({
  stories,
  initialStoryId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStory, setActiveStory] = useState<HealthStory | null>(
    stories.find((s) => s.id === initialStoryId) || null
  );

  const categories = ['All', 'Cycle & Hormones', 'Fatigue & Blood Health', 'Sleep & Mind', 'Skin & Gut'];

  const filteredStories = stories.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Youth Scientific Health Library
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Peer-Reviewed Explanations</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Evidence-Based Guides for Body, Mind & Hormones
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Short, high-impact readings on real physiological questions facing students and young adults.
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Ferritin, Sleep, Acne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-slate-300"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                <span className="font-semibold text-rose-600">{story.category}</span>
                <span>{story.readTime}</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                {story.title}
              </h4>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {story.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {story.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-[240px]">
                Source: {story.evidenceSource}
              </span>
              <span className="font-semibold text-slate-900 group-hover:underline">
                Read Story →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-rose-600">{activeStory.category}</span>
                <span>·</span>
                <span>{activeStory.readTime}</span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4 leading-tight">
              {activeStory.title}
            </h2>

            <div className="mt-2 text-xs text-slate-500">
              Evidence Basis: <strong>{activeStory.evidenceSource}</strong>
            </div>

            <div className="mt-6 prose prose-slate max-w-none text-xs leading-relaxed space-y-4 text-slate-700">
              {activeStory.contentMarkdown.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-slate-900 mt-4">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith('####')) {
                  return (
                    <h4 key={idx} className="text-sm font-semibold text-slate-800 mt-3">
                      {paragraph.replace('####', '').trim()}
                    </h4>
                  );
                }
                return <p key={idx}>{paragraph.trim()}</p>;
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>AuraHealth Educational Repository</span>
              <button
                onClick={() => setActiveStory(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
