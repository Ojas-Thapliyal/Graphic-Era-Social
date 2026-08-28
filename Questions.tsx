import React, { useState, useEffect } from 'react';
import { Question } from '../types/question';
import { getQuestions } from '../services/questions';
import { AskQuestion } from '../components/AskQuestion';
import { QuestionCard } from '../components/QuestionCard';

export const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Load questions from FastAPI backend
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestions();
      setQuestions(data);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError(err?.message || 'Unable to load campus questions. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Filter questions based on search query and selected filter tag
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTag =
      selectedTag === 'All' ||
      (q.subject && q.subject.toLowerCase() === selectedTag.toLowerCase()) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));

    return matchesSearch && matchesTag;
  });

  const filterCategories = ['All', 'Operating Systems', 'Algorithms', 'Placements', 'Exams', 'Campus Life'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Reddit-Style Subreddit Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20">
                r/GraphicEra • Q&A Hub
              </span>
              <span className="text-white/80 text-xs font-semibold">
                {questions.length} Campus Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Campus Questions & Doubts
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl">
              Ask questions, clear semester lab doubts, discuss exam patterns, and get insights from Graphic Era peers and alumni.
            </p>
          </div>

          <button
            onClick={loadQuestions}
            disabled={loading}
            title="Refresh questions feed"
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition active:scale-95 disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Ask Question Component Container */}
      <AskQuestion onQuestionSubmitted={loadQuestions} />

      {/* Search Bar & Category Filter Chips */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm mb-6 space-y-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search questions by keyword, topic, or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedTag === cat
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={loadQuestions}
            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && questions.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 animate-pulse flex gap-4"
            >
              <div className="w-10 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-12 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions Feed List */}
      {!loading && filteredQuestions.length === 0 && !error && (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
            ❓
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            No questions found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No doubts matching "${searchQuery}". Try a different keyword.`
              : 'Be the first student to ask a question or share a campus doubt!'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} onQuestionUpdated={loadQuestions} />
        ))}
      </div>
    </div>
  );
};
export default Questions;
