"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { LayoutGrid, MessageCircle, RotateCcw, Settings, Plus } from "lucide-react"

// APIから返される振り返りデータの型定義
interface Reflection {
  reflection_id: string
  user_id: string
  future_plans: string
  want_to_discuss: string
  created_at: string
}

// 表示用に整形した振り返りデータの型定義
interface FormattedReflection {
  id: string
  date: string
  person: string
  profileImage: string
  planToDo: string
  notEnoughTalked: string
  isPartner: boolean
}

// タブの型定義
type TabType = "self" | "partner"

export default function ReviewPage() {
  const [isClient, setIsClient] = useState(false)
  const [userName, setUserName] = useState("斎藤 俊輔")
  const [userId, setUserId] = useState("1")
  const [partnerName, setPartnerName] = useState("美海")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("self")
  const [inputUserId, setInputUserId] = useState("1") 
  const [isSettingId, setIsSettingId] = useState(false)

  // ユーザーIDを設定するハンドラー関数
  const handleSetUserId = () => {
    setIsSettingId(true)
    setUserId(inputUserId)
    
    // ユーザーIDが変更されたら振り返りデータを再取得
    fetchReflections(activeTab !== "self").finally(() => {
      setIsSettingId(false)
    })
  }

  

  // 振り返りデータ
  const [reviews, setReviews] = useState<FormattedReflection[]>([])

  const backendUrl = "http://localhost:8000"

  // 振り返りデータを取得する関数
  const fetchReflections = async (includePartner = true) => {
    setIsLoading(true)
    setError(null)

    try {
      // API仕様に基づいてリクエスト
      const response = await fetch(`${backendUrl}/reflections?user_id=${userId}&include_partner=${includePartner}`)

      if (!response.ok) {
        throw new Error(`API呼び出しに失敗しました: ${response.status} ${response.statusText}`)
      }

      const data: Reflection[] = await response.json()

      // データを表示用に整形
      const formattedData: FormattedReflection[] = data.map((item) => {
        // 日付をフォーマット
        const date = new Date(item.created_at)
        const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}/${String(date.getDate()).padStart(2, "0")}`

        // ユーザーIDに基づいて表示名を決定
        const isPrimaryUser = item.user_id === userId
        const displayPerson = isPrimaryUser ? userName.split(" ")[1] : partnerName

        return {
          id: item.reflection_id,
          date: formattedDate,
          person: displayPerson,
          profileImage: "/placeholder.svg?height=80&width=80",
          planToDo: item.future_plans,
          notEnoughTalked: item.want_to_discuss,
          isPartner: !isPrimaryUser,
        }
      })

      // 日付の新しい順にソート
      formattedData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      setReviews(formattedData)
    } catch (err) {
      console.error("振り返りデータの取得に失敗しました:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")

     
    } finally {
      setIsLoading(false)
    }
  }

  // タブ切り替え時の処理
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)

    if (tab === "self") {
      fetchReflections(false)
    } else if (tab === "partner") {
      fetchReflections(true).then(() => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.isPartner))
      })
    }
  }

  // フィルタリングされた振り返りを取得
  const getFilteredReviews = () => {
    if (activeTab === "self") {
      return reviews.filter((review) => !review.isPartner)
    } else {
      return reviews.filter((review) => review.isPartner)
    }
  }

  // クライアントサイドでのみレンダリングを行うためのフラグ
  useEffect(() => {
    setIsClient(true)
  }, [])

  // コンポーネントマウント時に振り返りデータを取得
  useEffect(() => {
    if (isClient && userId) {
      fetchReflections(false)
    }
  }, [isClient, userId])

  // クライアントサイドでのみレンダリングを行う
  if (!isClient) {
    return (
      <div className="h-screen bg-[#f8f3e9] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // 表示する振り返り
  const filteredReviews = getFilteredReviews()

  return (
    <div className="flex h-screen bg-[#f8f3e9]">
      {/* サイドバー - 既存のデザインを流用 */}
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
              <Link href="/dashboard" className="w-full">
                ダッシュボード
              </Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/conversation" className="w-full">
                今日のあのね！
              </Link>
            </li>
            <li className="flex items-center p-2 rounded bg-gray-100">
              <RotateCcw className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-medium">ふりかえり</span>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span>設定</span>
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
            <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
            <span className="text-xs text-gray-500">オンライン</span>
          </div>
        </div>
      </div>

    {/* メインコンテンツ - ふりかえり */}
<div className="flex-1 p-8 overflow-auto">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">ふりかえり</h1>
    
    {/* ユーザーID設定UI */}
    <div className="flex items-center">
      <div className="flex mr-4">
        <input
          type="text"
          value={inputUserId}
          onChange={(e) => setInputUserId(e.target.value)}
          className="w-24 h-10 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#e88e67] focus:border-transparent"
          placeholder="ユーザーID"
        />
        <button
          onClick={handleSetUserId}
          disabled={isSettingId}
          className={`h-10 px-4 py-2 bg-[#e88e67] text-white rounded-r-md hover:bg-[#d35f4d] transition-colors ${
            isSettingId ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSettingId ? "設定中..." : "ID設定"}
        </button>
      </div>
      
      <Link
        href="/review/create"
        className="bg-gradient-to-r from-[#f8d3a8] to-[#e88e67] text-white px-4 py-2 rounded-md flex items-center hover:from-[#e88e67] hover:to-[#d35f4d] transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        新規作成
      </Link>
    </div>
  </div>

        

        {/* タブ切り替え */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "self" ? "text-[#e88e67] border-b-2 border-[#e88e67]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("self")}
          >
            自分の振り返り
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "partner"
                ? "text-[#e88e67] border-b-2 border-[#e88e67]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("partner")}
          >
            パートナーの振り返り
          </button>
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e88e67]"></div>
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        )}

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            <p>振り返りデータの取得に失敗しました: {error}</p>
            <button
              onClick={() => fetchReflections(activeTab !== "self")}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              再試行
            </button>
          </div>
        )}

        {/* 振り返りカード */}
        {!isLoading && !error && filteredReviews.length === 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <p className="text-gray-500 mb-4">振り返りがまだありません</p>
            <Link href="/review/create" className="text-[#e88e67] hover:underline">
              最初の振り返りを作成しましょう
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/user-circle.svg"
                    alt={`${review.person}さんのプロフィール`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-medium">
                  {review.date} の対話振り返り
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-3">これからやろうと思うこと</h3>
                  <p className="text-gray-700 leading-relaxed">{review.planToDo}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">まだ話し足りないこと</h3>
                  <p className="text-gray-700 leading-relaxed">{review.notEnoughTalked}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
