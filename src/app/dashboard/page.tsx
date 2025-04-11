"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, MessageCircle, RotateCcw, Settings, Bell, Search } from 'lucide-react';
import { Zen_Maru_Gothic } from "next/font/google";
import { useRouter } from "next/navigation";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [userName, setUserName] = useState('斎藤 俊輔')
  const [userId, setUserId] = useState('1001')
  const [partnerName, setPartnerName] = useState('美海')
  const [emotionAlert, setEmotionAlert] = useState(null)

  const router = useRouter()

  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      //const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const baseUrl = "https://app-002-step3-2-py-oshima10.azurewebsites.net"
      const url = `${baseUrl}/structured_vector_search/fixed_all?user_id=${userId}&days=${days}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`リクエストが失敗しました: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      if (data.user_name) setUserName(data.user_name)

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

  const getPartnerSummary = () => {
    if (!result || !result.saved_summaries) return null;
    return result.saved_summaries.find(item =>
      item.query_key.toLowerCase().includes('partner') || item.query_key.includes('パートナー')
    )
  }

  const partnerSummary = getPartnerSummary()

  return (
    <div className="flex h-screen bg-[#f8f3e9]">
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
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">データ検索</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">ユーザーID</label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
                placeholder="ユーザーIDを入力"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">取得日数</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
                placeholder="取得する日数"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={fetchData}
              className="bg-[#e88e67] text-white px-6 py-2 rounded-md flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span>読み込み中...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  <span>検索</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* レポートカード */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* パートナーのレポート - APIデータを表示 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-6">
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
                {loading ? "読み込み中..." : `${new Date().getMonth() + 1}/${new Date().getDate()} ${partnerName}さんのレポート`}
              </h2>
            </div>
            
            {loading ? (
              <div className="py-8 text-center">
                <p>データを読み込んでいます...</p>
              </div>
            ) : result && result.saved_summaries ? (
              <div className="space-y-6">
                {result.saved_summaries.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-bold mb-2">【{item.query_key}】</h3>
                    <p className="text-sm leading-relaxed">
                      {item.summay_text}
                    </p>
                  </div>
                ))}
                
                {result.saved_summaries.length === 0 && (
                  <p className="text-center py-4 text-gray-500">サマリーが見つかりませんでした。</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">【今週のパートナーの状況】</h3>
                  <p className="text-sm leading-relaxed">
                    今週は、お子さんの寝る前の支度をすべて担当してくれたり、仕事終わりにお子さんのためにお菓子を買ってきてくれたりしたこと、家族への気遣いが感じられる行動がありました。一方で、家事の分担については少し負担が偏っているように感じる場面もあったようです。また、一昨日は少し疲れが見えて、気持ちが不安定だった様子がうかがえました。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">【あなたに対するコメント】</h3>
                  <p className="text-sm leading-relaxed">
                    お子さんの寝る前の支度を任せられたこと、大変助かったとのことです。また、お菓子を買ってきてくれた気遣いがとても嬉しかったそうです。ただし、家事の分担では負担が不均等なこと、少し手伝ってほしいと思う場面もあったようです。また、疲れているときの態度についても少し気になったようなので、無理をせずリラックスできる時間を作るとよいかもしれません。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">【夫婦で話し合いたいこと】</h3>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>家を購入することについての具体的な計画。</li>
                    <li>今週末、流流機を見に行く予定の確認。</li>
                    <li>ゴールデンウィークの旅行の計画や目的地について。</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* 自分のレポート */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
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
              <h2 className="text-lg font-medium">3/20 {userName.split(' ')[1] || ''}さんのレポート</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">【今週の状況】</h3>
                <p className="text-sm leading-relaxed">
                  今週は比較的に安定した1週間でした。家事や育児を協力して進めながら、自分の時間も確保できたことで、充実感を得られたようです。オンラインスクールの学習時間も確保でき、学びを積み、成長ができました。一方で、時間の使い方についてはもう少しエネできたかもしれないと感じています。来週は前の習慣づけやタスク管理の開始、タスク管理の強化を意識したいようです。
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">【あなたに対するコメント】</h3>
                <p className="text-sm leading-relaxed">
                  家事や育児を協力してくれたことや、子どもへの愛情をたくさん注いでくれたことに感謝しています。特に、オンラインスクールの時間を作れるよう協力してくれたことがとても助かったとのことです。一方で、雑談のときに少しそっけなく感じることがあったようです。育児や仕事の話にはしっかり耳を傾けてくれるので、そこまで気にしているわけではないようです。
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">【夫婦で話し合いたいこと】</h3>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>保育園開始後の家事・育児の役割分担</li>
                  <li>子どもが病気になった際の対応フロー（休む人の調整、病児保育の利用など）</li>
                  <li>復職前にやっておきたいことのリスト化（家の整理、役所の手続き、自己学習など）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 対話推奨度 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">対話推奨度：今すぐ対話することをおすすめします！</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">対話のアジェンダ</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>先日機嫌が悪かったこと</li>
              <li>子供の育児の分担のこと</li>
              <li>復職後の役割分担</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-[#e88e67] text-white px-8 py-2 rounded-md">
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
