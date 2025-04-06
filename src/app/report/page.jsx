"use client";
import { useState } from "react";

export default function Page() {
  const [userId, setUserId] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // FastAPI側のURLはご利用環境に合わせて修正してください
      const baseUrl = "http://localhost:8000";
      const url = `${baseUrl}/structured_vector_search/fixed_all?user_id=${userId}&days=${days}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status code: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Structured Vector Search (fixed_all)</h1>
      <div style={{ marginBottom: "0.5rem" }}>
        <label>User ID: </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="ユーザーIDを入力"
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Days: </label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="取得する日数"
        />
      </div>

      <button onClick={handleFetch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 検索結果表示 */}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Result</h2>
          {/* user_name と user_id / days_in_range */}
          <div
            style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}
          >
            <p>
              <strong>user_id: </strong>
              {result.user_id}
            </p>
            <p>
              <strong>user_name: </strong>
              {result.user_name}
            </p>
            <p>
              <strong>days_in_range: </strong>
              {result.days_in_range}
            </p>
          </div>

          {/* saved_summaries があればループ表示 */}
          {result.saved_summaries && result.saved_summaries.length > 0 ? (
            result.saved_summaries.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <p>
                  <strong>Query Key:</strong> {item.query_key}
                </p>

                {/* Merged Documents はあえて非表示にし、summary_text のみ表示 */}
                <div>
                  <strong>Summary Text:</strong>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "0.5rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.summay_text}
                  </pre>
                </div>
              </div>
            ))
          ) : (
            <p>No summaries found.</p>
          )}
        </div>
      )}
    </div>
  );
}
