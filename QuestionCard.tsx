import React, { useState } from 'react';
import { Question } from '../types/question';
import { upvoteQuestion, answerQuestion } from '../services/api';

interface QuestionCardProps {
  question: Question;
  onQuestionUpdated?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onQuestionUpdated }) => {
  const [upvoted, setUpvoted] = useState<boolean>(question.is_upvoted || false);
  const [upvotes, setUpvotes] = useState<number>(question.upvotes ?? 0);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [answers, setAnswers] = useState(question.answers || []);
  const [newAnswerText, setNewAnswerText] = useState<string>('');
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false);

  const authorName = question.author || 'Anonymous Student';
  const authorBranch = question.branch || 'Graphic Era Student';
  const authorAvatar =
    question.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  const displayDate = question.created_at || question.timestamp || 'Recent';

  const handleUpvote = async () => {
    try {
      const newStatus = !upvoted;
      setUpvoted(newStatus);
      setUpvotes((prev) => Math.max(0, prev + (newStatus ? 1 : -1)));

      const res = await upvoteQuestion(question.id);
      if (res && res.question) {
        setUpvoted(res.question.is_upvoted);
        setUpvotes(res.question.upvotes);
      }
    } catch (err) {
      console.error('Failed to upvote question:', err);
    }
  };

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerText.trim()) return;

    try {
      setSubmittingAnswer(true);
      const res = await answerQuestion(question.id, { text: newAnswerText.trim() });
      if (res && res.answer) {
        setAnswers((prev) => [...prev, res.answer]);
        setNewAnswerText('');
        if (onQuestionUpdated) onQuestionUpdated();
      }
    } catch (err) {
      console.error('Failed to add answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex">
        {/* Reddit-style Left Karma / Upvote Indicator Pillar */}
        <div className="w-12 sm:w-14 bg-slate-50/60 dark:bg-slate-900/40 border-r border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-start pt-4 px-1 gap-1 select-none flex-shrink-0">
          <button
            type="button"
            onClick={handleUpvote}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
              upvoted
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
            title="Upvote"
          >
            <span className="text-sm font-bold">▲</span>
          </button>

          <span className={`text-xs font-extrabold ${upvoted ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
            {upvotes}
          </span>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-4 sm:p-5">
          {/* Metadata Header */}
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {authorName}
                </span>
                <span>•</span>
                <span className="truncate max-w-[150px] sm:max-w-[220px]">
                  {authorBranch}
                </span>
              </div>
            </div>

            {/* Creation Date / Timestamp Badge */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-2 py-0.5 rounded-md">
              <span>🕒</span>
              <span>{displayDate}</span>
            </div>
          </div>

          {/* Subject / Category Badge (if present) */}
          {question.subject && (
            <div className="mb-2">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                {question.subject}
              </span>
            </div>
          )}

          {/* Question Title */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer mb-2">
            {question.title}
          </h2>

          {/* Question Description */}
          {question.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-line mb-3.5">
              {question.description}
            </p>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {question.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition cursor-pointer"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Reddit-style Footer Action Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowAnswers(!showAnswers)}
                className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
              >
                <span>💬</span>
                <span>{answers.length} Answers</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Graphic Era Q&A
            </span>
          </div>

          {/* Expandable Answers Section */}
          {showAnswers && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
              {answers.length > 0 ? (
                answers.map((ans: any, idx: number) => (
                  <div key={ans.id || idx} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ans.author || 'Senior Student'}</span>
                      <span className="text-[10px] text-slate-400">{ans.time || 'Recently'}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-normal">{ans.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No answers yet. Be the first to reply!</p>
              )}

              {/* Submit Answer Input */}
              <form onSubmit={handleAddAnswer} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write your answer or explanation..."
                  value={newAnswerText}
                  onChange={(e) => setNewAnswerText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={submittingAnswer || !newAnswerText.trim()}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-sm"
                >
                  {submittingAnswer ? 'Posting...' : 'Reply'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;
