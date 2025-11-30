"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    setLoading(true);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Summarizer</h1>

      <textarea
        className="w-full border p-3 rounded h-40"
        placeholder="Paste text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={summarize}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Summary:</h2>
          <p className="text-gray-800">{summary}</p>
        </div>
      )}
    </div>
  );
}
