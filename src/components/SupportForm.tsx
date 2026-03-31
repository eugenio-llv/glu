import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function SupportForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('feedback');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://formfy.layline.ventures/glu@layline.ventures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name,
          email,
          category,
          message,
          _subject: `Glu Support: ${category === 'feedback' ? 'Feedback' : category === 'issue' ? 'Bug Report' : 'Question'} from ${name}`,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setCategory('feedback');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="px-6 py-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-dm-sans text-emerald-800 font-medium text-lg">
          Message received!
        </p>
        <p className="text-sm text-emerald-600 mt-2 max-w-sm mx-auto">
          Thanks for reaching out. We'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-4 decoration-emerald-300 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-dm-sans text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-dm-sans text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
          What can we help with?
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={status === 'loading'}
          className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-dm-sans text-base focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 disabled:opacity-50 appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center' }}
        >
          <option value="feedback">Share feedback</option>
          <option value="issue">Report an issue</option>
          <option value="question">Ask a question</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind..."
          required
          disabled={status === 'loading'}
          rows={5}
          className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-dm-sans text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 disabled:opacity-50 resize-none"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-neutral-800 text-white font-dm-sans font-medium text-base rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
