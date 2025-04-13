"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, MessageCircle, RotateCcw, Settings, Bell, Search } from 'lucide-react';
import { Zen_Maru_Gothic } from "next/font/google";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [emotionAlert, setEmotionAlert] = useState(null)

  const router = useRouter()

  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [adviceText, setAdviceText] = useState<string | null>(null)
  const [adviceLoading,setAdviceLoading] = useState(false)
  const [adviceError, setAdviceError] = useState("")
  const [userIdInput, setUserIdInput] = useState("")


  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      // const baseUrl = "https://app-002-step3-2-py-oshima10.azurewebsites.net"
      const url = `${baseUrl}/structured_vector_search/fixed_all?user_id=${userId}&days=${days}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`リクエストが失敗しました: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      if (data.user_name) setUserName(data.user_name)
      if (data.partner_name) setPartnerName(data.partner_name)

    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // 🧠 感情アラートを取得する
  const fetchEmotionAlert = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(`${baseUrl}/emotion_alert/latest?user_id=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setEmotionAlert(data)
      }
    } catch (e) {
      console.error("感情アラート取得エラー:", e)
    }
  }

  useEffect(() => {
    if (isClient && userId) {
      fetchData()
      fetchEmotionAlert()
    }
  }, [isClient, userId])

  if (!isClient) {
    return (
      <div className="h-screen bg-[#f8f3e9] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

const fetchAdvice = async() => {
  setAdviceLoading(true)
  setAdviceError("")
  try{
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    // const baseUrl = "https://app-002-step3-2-py-oshima10.azurewebsites.net"
    const res = await fetch(`${baseUrl}/dialogue_advice?user_id=${userId}`)
    if(!res.ok){
      throw new Error("アドバイスの取得に失敗しました")
    }
    const data = await res.json()
    setAdviceText(data.advice)
  } catch(e){
    setAdviceError((e as Error).message)
  } finally{
    setAdviceLoading(false)
  }
};

const handleUserIdUpdate = async (e:React.FormEvent) => {
  e.preventDefault()
  setUserId(userIdInput)
  await fetchData()
  await fetchEmotionAlert()
};
  return (
    <div className="flex h-screen bg-[#f8f3e9]">
       {/* エラーがあるときに中央上部に表示 */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 text-red-700 px-4 py-2 rounded shadow-md">
            {error}
          </div>
        )}
      {/* Sidebar */}
      <div className={`w-64 bg-white p-6 flex flex-col ${zenMaruGothic.className}`}>
        {/* ロゴとナビゲーション */}
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 mr-2">
            <Image src="/images/robot-logo.svg" alt="AIロゴ" width={40} height={40} priority unoptimized />
          </div>
          <h2 className="text-lg font-medium">ふたりのAIさん</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li className="flex items-center p-2 rounded bg-gray-100">
              <LayoutGrid className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-medium">ダッシュボード</span>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/conversation" className="w-full">今日のあのね！</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <RotateCcw className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/review" className="w-full">ふりかえり</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/login" className="w-full">設定</Link>
            </li>
          </ul>
        </nav>
        {/* ユーザー情報 */}
        <div className="mt-auto flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <Image src="/user-circle.svg" alt="ユーザー" width={48} height={48} className="object-cover" />
          </div>
          <p className="text-sm font-medium">{userName}</p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
          <div className="flex space-x-4">
           {/* 😡 感情アラート表示（ポップアップ付き） */}
           <div className="relative group bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center shadow-sm">
            <Bell className="w-5 h-5 text-red-500 mr-2" />
            {emotionAlert ? (
              <>
              <span className="text-sm text-gray-800 font-semibold">
                {emotionAlert.emoji} {emotionAlert.label}
                </span>
                {/* ホバー時のメッセージ表示 */}
                <div className="absolute top-full mt-2 left-0 w-64 z-10 hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-700">
                  {emotionAlert.message}
                  </div>
                  </>
                  ) : (
                  <span className="text-sm text-gray-800">感情アラートはありません</span>
                  )}
                  </div>
            <button
              onClick={() => router.push("/conversation")}
              className="bg-gradient-to-r from-[#f8d3a8] to-[#e88e67] text-white px-6 py-2 rounded-md"
            >
              今日のあのね！
            </button>
            
          </div>
        </div>

        {/* API検索パネル */}
        <div className="flex justify-end mb-4 mr-4">
          <div className="flex item-center space-x-4">
            <h2 className="text-sm font-semibold text-gray-700 mt-2">ユーザーIDを設定してレポート生成</h2>
            
            <form onSubmit={handleUserIdUpdate} className="flex items-center space-x-2">
              <input
                type="number"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="ユーザーID"
                className="p-1.5 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e88e67]"
                disabled={loading}
              />
              <button
                type="submit"
                className={`${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#d35f4d] hover:bg-[#c04a3a]"
                } text-white px-3 py-1.5 text-sm rounded transition-colors`}
                disabled={loading}
              >
                レポート生成
              </button>
              <span className="text-xs text-gray-500">現在のID: {userId}</span>
            </form>
          </div>
        </div>

        {/* レポートカード */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* パートナーのレポート - APIデータを表示 */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-[550px] overflow-hidden">
            <div className="h-full overflow-y-auto pr-2">
              <div className="flex items-center mb-6 ">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/user-circle.svg"
                    alt={`${partnerName}さんのプロフィール`}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-medium">
                  {loading ? "読み込み中..." : `${new Date().getMonth() + 1}/${new Date().getDate()} ${partnerName}のレポート`}
                </h2>
              </div>
              
              {loading ? (
                <div className="py-8 text-center">
                  <p>データを読み込んでいます...</p>
                </div>
              ) : result && result.partner_summaries ? (
                <div className="space-y-6">
                  {result.partner_summaries.map((item, index) => (
                    <div key={index}>
                      <h3 className="font-bold mb-2">【{item.query_key}】</h3>
                      <div className="prose prose-sm">
                        <ReactMarkdown>{item.summay_text}</ReactMarkdown>
                      </div>
                  </div>
                ))}
              </div>
              ) : (
                <p className="text-gray-500 text-sm">パートナーのレポートは見つかりませんでした</p>
              )}
            </div>
          </div>
          {/* 自分のレポート */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-[550px] overflow-hidden">
            <div className="h-full overflow-y-auto pr-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/user-circle.svg"
                    alt="ユーザープロフィール"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-medium">
                {loading ? "読み込み中..." : `${new Date().getMonth() + 1}/${new Date().getDate()} ${userName}のレポート`}
                </h2>
              </div>
              {loading ? (
                <div className="py-8 text-center">
                  <p>データを読み込んでいます...</p>
                </div>
              ) : result && result.user_summaries ? (
                <div className="space-y-6">
                  {result.user_summaries.map((item, index) => (
                    <div key={index}>
                      <h3 className="font-bold mb-2">【{item.query_key}】</h3>
                      <div className="prose prose-sm">
                        <ReactMarkdown>{item.summay_text}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">自分のレポートは見つかりませんでした。</p>
              )}
            </div>
          </div>
        </div>

        {/* 対話アドバイス */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">ふたりの対話アドバイス</h2>
          
          {adviceLoading && <p className="text-gray-500 mt-4">アドバイスを生成中です...</p>}
          {adviceError && <p className="text-red-500 mt-4">{adviceError}</p>}
          {adviceText && (
            <div className="mt-4 bg-yellow-50 p-4 rounded shadow-sm border border-yellow-200">
              <h3 className="font-bold mb-2 text-[#e88e67]">ふたりで話し合ってみましょう！</h3>
              <div className="whitespace-pre-line text-sm">
                <ReactMarkdown>{adviceText}</ReactMarkdown>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              className="bg-[#e88e67] text-white px-8 py-2 rounded-md"
              onClick={fetchAdvice}
              >
              アドバイス
            </button>
            <button className="bg-[#d35f4d] text-white px-8 py-2 rounded-md">
              対話した
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
