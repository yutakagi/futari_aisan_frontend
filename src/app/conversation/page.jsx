'use client';

import { useState, useEffect } from 'react';

export default function ConversationPage() {
  const [sessionId, setSessionId] = useState('');
  const [round, setRound] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [userId, setUserId] = useState('');
  const [isUserIdConfirmed, setIsUserIdConfirmed] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const backendUrl = "https://app-002-step3-2-py-oshima10.azurewebsites.net";

  // バックエンド /chat エンドポイントへのリクエスト
  const callChatApi = async (answer) => {
    const payload = {
      user_id: userId,
      session_id: sessionId || undefined,
      answer: answer || ""
    };

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("API 呼び出しに失敗しました");
      const data = await res.json();

      // 新規セッションの場合、セッションIDを保存
      if (!sessionId && data.session_id) setSessionId(data.session_id);

      // ユーザーからの入力と、バックエンドからのフィードバックをチャット履歴に追加
      setChatHistory((prev) => [
        ...prev,
        ...(answer ? [{ speaker: "ユーザー", message: answer }] : []),
        { speaker: "アイさん", message: data.feedback }
      ]);

      setRound(data.round);
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  };

  //ユーザーIDを確定し、セッションを開始する
  const handleConfirmUserId = () => {
    if (userId.trim() === ''){
        alert("ユーザーIDを入力してください。");
        return;
    }
    setIsUserIdConfirmed(true);
    callChatApi("");//ユーザーID確定時にセッションを開始
  }

  // 入力送信時のハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    await callChatApi(userInput);
    setUserInput("");
  };

  // 会話履歴保存用エンドポイント /save_conversation を呼び出す
  const handleSaveConversation = async () => {
    if (!sessionId || !userId) {
      alert("セッションまたはユーザーIDが未設定です。");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/save_conversation?session_id=${sessionId}&user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("会話の保存に失敗しました");
      await res.json();
      setSaveStatus("会話が保存されました！");
    } catch (error) {
      console.error(error);
      alert("会話の保存中にエラーが発生しました。");
      setSaveStatus("保存に失敗しました。");
    }
  };

  // 新規セッション開始時の状態リセット
  const handleNewSession = () => {
    setSessionId('');
    setChatHistory([]);
    setRound(0);
    setSaveStatus('');
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>今日のあのね！</h1>
      <div style={{ marginBottom: "20px" }}>
        {!isUserIdConfirmed ? (
        <>
        <label>
          ユーザーID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ユーザーIDを入力..."
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
        <button onClick={handleConfirmUserId} style={{ marginLeft:"10px", padding:"5px 10px"}}>
            ユーザーIDを確定
            </button>
            </>
         ) : (
            <p>ユーザーID:{userId}</p>
        )}
        </div>

      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "300px", marginBottom: "20px", overflowY: "auto" }}>
        {chatHistory.map((entry, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{entry.speaker}:</strong> {entry.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="ここに入力..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
          送信
        </button>
      </form>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleSaveConversation} style={{ padding: "10px 20px", marginRight: "10px" }}>
          会話を保存
        </button>
        <button onClick={handleNewSession} style={{ padding: "10px 20px" }}>
          新規セッション
        </button>
      </div>
      {saveStatus && <p>{saveStatus}</p>}
      <p>ラウンド: {round}</p>
    </div>
  );
}