// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [input, setInput] = useState("");
//   const [summary, setSummary] = useState("");
//   const [loading, setLoading] = useState(false);

//   const summarize = async () => {
//     setLoading(true);

//     const res = await fetch("/api/summarize", {
//       method: "POST",
//       body: JSON.stringify({ text: input }),
//     });

//     const data = await res.json();
//     setSummary(data.summary);
//     setLoading(false);
//   };

//   return (
//     <div className="p-10 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">AI Summarizer</h1>

//       <textarea
//         className="w-full border p-3 rounded h-40"
//         placeholder="Paste text here..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button
//         onClick={summarize}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//         disabled={loading}
//       >
//         {loading ? "Summarizing..." : "Summarize"}
//       </button>

//       {summary && (
//         <div className="mt-6 p-4 border rounded bg-gray-100">
//           <h2 className="text-xl font-semibold mb-2 text-gray-800">Summary:</h2>
//           <p className="text-gray-800">{summary}</p>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{
    originalLength: number;
    summaryLength: number;
  } | null>(null);

  const summarize = async () => {
    if (!input.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");
    setStats(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize");
      }

      setSummary(data.summary);
      setStats({
        originalLength: data.originalLength,
        summaryLength: data.summaryLength,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setSummary("");
    setError("");
    setStats(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert("Summary copied to clipboard!");
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const charCount = input.length;
  const maxChars = 10000;
  const isNearLimit = charCount > maxChars * 0.9;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🧠 AI Summarizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Transform long text into concise summaries using AI
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Input Text
              </label>
              <span
                className={`text-sm ${
                  isNearLimit ? "text-red-600" : "text-gray-500"
                }`}
              >
                {charCount.toLocaleString()} / {maxChars.toLocaleString()}
              </span>
            </div>
            <textarea
              className="w-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Paste your text here to get started..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={summarize}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Summarizing...
                </span>
              ) : (
                "✨ Summarize"
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Summary Section */}
          {summary && (
            <div className="animate-fade-in">
              {/* Stats */}
              {stats && (
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Original
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.originalLength.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">characters</p>
                  </div>
                  <div className="flex-1 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Summary
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.summaryLength.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">characters</p>
                  </div>
                  <div className="flex-1 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reduction
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(
                        ((stats.originalLength - stats.summaryLength) /
                          stats.originalLength) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                    <p className="text-xs text-gray-500">smaller</p>
                  </div>
                </div>
              )}

              {/* Summary Content */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    📝 Summary
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
          Powered by OpenAI GPT-4o-mini
        </div>
      </div>
    </div>
  );
}