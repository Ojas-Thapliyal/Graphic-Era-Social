import React, { useState } from 'react';
import { postQuestion } from '../services/questions';

interface AskQuestionProps {
  onQuestionSubmitted: () => void;
}

export const AskQuestion: React.FC<AskQuestionProps> = ({ onQuestionSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a question title.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Parse tags (comma-separated or space-separated, prepending '#' if needed)
      const parsedTags = tagsInput
        .split(/[, ]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));

      await postQuestion({
        title: title.trim(),
        description: description.trim() || undefined,
        subject: subject.trim() || 'General',
        tags: parsedTags.length > 0 ? parsedTags : ['#CampusDoubt', '#GEU'],
      });

      // Clear form
      setTitle('');
      setDescription('');
      setTagsInput('');
      setSubject('General');
      setIsExpanded(false);

      // Trigger automatic refresh
      onQuestionSubmitted();
    } catch (err: any) {
      console.error('Failed to submit question:', err);
      setError(err?.message || 'Failed to submit question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 overflow-hidden mb-6">
      {/* Reddit-style collapsed prompt / header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
            💬
          </div>

          <input
            type="text"
            placeholder="Ask anything, discuss topics, or share a campus doubt..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isExpanded) setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
          />

          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition duration-150"
            >
              <span>Ask</span>
              <span>✏️</span>
            </button>
          )}
        </div>

        {/* Expanded Form Fields */}
        {isExpanded && (
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Category / Subject selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Subject / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems, Placements, Fest, General"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Tags (comma or space separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. #OS, #MidTerms, #Coding, #GEU"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Question Details / Description
              </label>
              <textarea
                rows={4}
                placeholder="Provide additional details, context, code snippet, or specifics about what you're asking..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-y"
              />
            </div>

            {/* Tag preview pill display */}
            {tagsInput.trim() && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Preview:</span>
                {tagsInput
                  .split(/[, ]+/)
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
                  .map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-medium border border-amber-200 dark:border-amber-800/40"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                💡 Clear titles get faster answers from seniors & peers.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  disabled={submitting}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>Post Question</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default AskQuestion;
