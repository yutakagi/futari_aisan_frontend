const backendUrl = "http://localhost:8000";

export const fetchApi = async (endpoint, options) => {
  try {
    const res = await fetch(`${backendUrl}/${endpoint}`, options);
    if (!res.ok) throw new Error(`APIエラー: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    alert(`エラーが発生しました: ${error.message}`);
    throw error;
  }
};

export const chatApi = async (payload) => {
  return fetchApi("chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const saveConversationApi = async (sessionId, userId) => {
  return fetchApi(`save_conversation?session_id=${sessionId}&user_id=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};
