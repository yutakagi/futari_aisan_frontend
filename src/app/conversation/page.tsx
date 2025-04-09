"use client"

import { useState, useEffect, useRef } from "react"
import { LayoutGrid, MessageCircle, RotateCcw, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ConversationPage() {
  // 静的な初期値を使用
  const [sessionId, setSessionId] = useState("")
  const [round, setRound] = useState(0)
  const [chatHistory, setChatHistory] = useState([])
  const [userInput, setUserInput] = useState("")
  const [userId, setUserId] = useState("1001")
  const [userIdInput, setUserIdInput] = useState("1001") // デバッグ用ユーザーID入力
  const [userName, setUserName] = useState("斎藤 俊輔")
  const [saveStatus, setSaveStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const [isClient, setIsClient] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // クライアントサイドでのみレンダリングを行うためのフラグ
  useEffect(() => {
    setIsClient(true)
  }, [])

  // バックエンド /chat エンドポイントへのリクエスト
  const callChatApi = async (answer) => {
    if (!isClient) return

    const payload = {
      user_id: userId,
      session_id: sessionId || undefined,
      answer: answer || "",
    }

    setIsLoading(true)

    try {
      // 実際のAPIコール
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`API呼び出しに失敗しました: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()

      // 新規セッションの場合、セッションIDを保存
      if (!sessionId && data.session_id) {
        setSessionId(data.session_id)
      }

      // ユーザーからの入力と、バックエンドからのフィードバックをチャット履歴に追加
      setChatHistory((prev) => [
        ...prev,
        ...(answer ? [{ speaker: "ユーザー", message: answer, isUser: true }] : []),
        { speaker: "AIさん", message: data.feedback, isUser: false },
      ])

      setRound(data.round)
    } catch (error) {
      console.error("APIエラー:", error)
      alert(`エラーが発生しました: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ユーザーIDが入力済みでセッションが未開始の場合にセッションを開始
  useEffect(() => {
    if (isClient && !sessionId && userId.trim() !== "") {
      callChatApi("")
    }
  }, [isClient, userId, sessionId])

  // チャット履歴が更新されたら、スクロールを一番下に移動
  useEffect(() => {
    if (isClient && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [isClient, chatHistory])

  // 入力送信時のハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim() || isLoading) return
    await callChatApi(userInput)
    setUserInput("")
  }

  // ユーザーID更新ハンドラー
  const handleUserIdUpdate = (e) => {
    e.preventDefault()
    if (isLoading) return
    setUserId(userIdInput)
    handleNewSession()
  }

  // 会話履歴保存用エンドポイント /save_conversation を呼び出す
  const handleSaveConversation = async () => {
    if (!sessionId || !userId) {
      alert("セッションまたはユーザーIDが未設定です。")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${backendUrl}/save_conversation?session_id=${sessionId}&user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error(`会話の保存に失敗しました: ${res.status} ${res.statusText}`)
      }

      await res.json()
      setSaveStatus("会話が保存されました！")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (error) {
      console.error("保存エラー:", error)
      alert(`会話の保存中にエラーが発生しました: ${error.message}`)
      setSaveStatus("保存に失敗しました。")
    } finally {
      setIsLoading(false)
    }
  }

  // 新規セッション開始時の状態リセット
  const handleNewSession = () => {
    if (isLoading) return
    setSessionId("")
    setChatHistory([])
    setRound(0)
    setSaveStatus("")
  }

  // クライアントサイドでのみレンダリングを行う
  if (!isClient) {
    return (
      <div className="h-screen bg-[#f8f3e9] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f8f3e9]">
      {/* サイドバー */}
      <div className="w-64 bg-white p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 mr-2">
            <Image
              src="/images/robot-logo.svg"
              alt="AIロボットロゴ"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-lg font-medium">ふたりのAIさん</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <LayoutGrid className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/dashboard" className="w-full">ダッシュボード</Link>
            </li>
            <li className="flex items-center p-2 rounded bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/conversation" className="w-full">今日のあのね！</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <RotateCcw className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/review" className="w-full">ふりかえり</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/review" className="w-full">設定</Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <Image
              src="/user-circle.svg"
              alt="ユーザープロフィール"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{userName}</p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">今日のあのね！</h1>
          
          {/* デバッグ用ユーザーID入力 */}
          <div className="flex items-center">
            <form onSubmit={handleUserIdUpdate} className="flex">
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="ユーザーID"
                className="p-2 text-sm rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#d35f4d] hover:bg-[#c04a3a]"
                } text-white px-3 py-2 text-sm rounded-r-lg transition-colors`}
                disabled={isLoading}
              >
                ID設定
              </button>
            </form>
            <div className="ml-2 text-sm text-gray-500">
              現在のID: {userId}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-hidden">
          <div ref={chatContainerRef} className="bg-white rounded-lg p-6 h-full overflow-y-auto shadow-sm">
            {/* チャット履歴 */}
            <div className="space-y-6 pb-10">
              {chatHistory.map((entry, index) => (
                <div key={index} className={`flex ${entry.isUser ? "justify-end" : "justify-start"} items-start`}>
                  {!entry.isUser && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0 mt-1">
                      <Image
                        src="/images/robot-logo.svg"
                        alt="AIロボット"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                      entry.isUser
                        ? "bg-gradient-to-r from-[#f8d3a8] to-[#e88e67] text-black"
                        : "bg-gradient-to-r from-[#e88e67] to-[#d35f4d] text-white"
                    }`}
                  >
                    <p>{entry.message}</p>
                  </div>
                  {entry.isUser && (
                    <div className="w-8 h-8 ml-2 flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt="ユーザー"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {chatHistory.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">会話を始めましょう</p>
              </div>
            )}

            {isLoading && (
              <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d35f4d] mr-2"></div>
                  <span>処理中...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#d35f4d] hover:bg-[#c04a3a]"
              } text-white px-6 py-3 rounded-r-lg transition-colors`}
              disabled={isLoading}
            >
              送信
            </button>
          </form>

          <div className="flex justify-between mt-4">
            <div>
              {saveStatus && <p className="text-green-600">{saveStatus}</p>}
              <p className="text-sm text-gray-500">ラウンド: {round}</p>
            </div>
            <div className="space-x-3">
              <button
                onClick={handleSaveConversation}
                className={`px-4 py-2 border border-[#d35f4d] text-[#d35f4d] rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fff8f7]"
                } transition-colors`}
                disabled={isLoading}
              >
                会話を保存
              </button>
              <button
                onClick={handleNewSession}
                className={`px-4 py-2 border border-gray-300 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                } transition-colors`}
                disabled={isLoading}
              >
                新規セッション
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
