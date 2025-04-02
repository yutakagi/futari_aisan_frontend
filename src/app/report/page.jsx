// ユーザーがレポートとアドバイスを取得する為のページ
// repo-to_ragエンドポイントにGETリクエストを送信し、RAG処理によって生成されたアドバイスを画面に表示
"use client"

import { useState } from 'react';

export default function Report() {
  const [userId, setUserId] = useState("");
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    const res = await fetch(`https://app-002-step3-2-py-oshima10.azurewebsites.net/report/?user_id=${userId}`);
    const data = await res.json();
    setReportData(data);
  };

  return (
    <div>
      <h1>レポート＆アドバイス</h1>
      <label>
        User ID:{" "}
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <button onClick={fetchReport}>Fetch Report</button>
      {reportData && (
        <div>
          <h2>今週の状況</h2>
          <p>{reportData.first}</p>
          <h2>パートナーへのコメント</h2>
          <p>{reportData.second}</p>
          <h2>夫婦で話したいこと夫婦で話したいこと</h2>
          <p>{reportData.third}</p>
        </div>
      )}
    </div>
  );
}
