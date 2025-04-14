"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutGrid, MessageCircle, RotateCcw, Settings } from "lucide-react"

// APIから返されるレポートリマインドの型定義
interface ReportReminding {
  Goodthing_remind: string
  Badthing_remind: string
}

export default function CreateReviewPage() {
  const [isClient, setIsClient] = useState(false)
  const [userName, setUserName] = useState("斎藤 俊輔")
  const [userId, setUserId] = useState("1")
  const [inputUserId, setInputUserId] = useState("1")
  const [currentUserId, setCurrentUserId] = useState("1")
  const [planToDo, setPlanToDo] = useState("")
  const [notEnoughTalked, setNotEnoughTalked] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reminding, setReminding] = useState<ReportReminding>({
    Goodthing_remind: "",
    Badthing_remind: "",
  })
  const router = useRouter()
  const backendUrl = "https://app-002-step3-2-py-oshima10.azurewebsites.net"

  // ユーザーID変更のハンドラ関数 - これが欠けていた
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUserId(e.target.value)
  }

  // ユーザーID設定のハンドラ関数 - これが欠けていた
  const handleUserIdSubmit = () => {
    setCurrentUserId(inputUserId)
    setUserId(inputUserId)
    fetchReportReminding()
  }

  // クライアントサイドでのみレンダリングを行うためのフラグ
  useEffect(() => {
    setIsClient(true)
  }, [])

  // レポートリマインドを取得する関数
  const fetchReportReminding = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // API仕様に基づいてリクエスト
      const response = await fetch(`${backendUrl}/report_reminding?user_id=${userId}`)

      if (!response.ok) {
        throw new Error(`API呼び出しに失敗しました: ${response.status} ${response.statusText}`)
      }

      const data: ReportReminding = await response.json()
      setReminding(data)
    } catch (err) {
      console.error("レポートリマインドの取得に失敗しました:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")

      // エラー時にはダミーデータを設定
      setReminding({
        Goodthing_remind: "APIからデータを取得できませんでした。",
        Badthing_remind: "APIからデータを取得できませんでした。",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // コンポーネントマウント時にレポートリマインドを取得
  useEffect(() => {
    if (isClient && userId) {
      fetchReportReminding()
    }
  }, [isClient, userId])

  // 振り返りを送信する処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!planToDo.trim() || !notEnoughTalked.trim()) {
      alert("両方の項目を入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      // API仕様に基づいたリクエストボディの作成
      const requestBody = {
        reflection_id: `refl_${Date.now()}`, // 一意のIDを生成
        user_id: userId,
        future_plans: planToDo,
        want_to_discuss: notEnoughTalked,
        created_at: new Date().toISOString(),
      }

      // 実際のAPIエンドポイントを呼び出す
      const response = await fetch(`${backendUrl}/reflections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API呼び出しに失敗しました: ${response.status} ${response.statusText}`)
      }

      // 成功したら振り返り一覧ページに遷移
      router.push("/review")
    } catch (error) {
      console.error("振り返りの保存に失敗しました:", error)
      alert(`振り返りの保存に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // クライアントサイドでのみレンダリングを行う
  if (!isClient) {
    return (
      <div className="h-screen bg-[#f8f3e9] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // returnは1つだけにする - 2つのreturnを1つに統合
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
              <Link href="/" className="w-full">
                今日のあのね！
              </Link>
            </li>
            <li className="flex items-center p-2 rounded bg-gray-100">
              <RotateCcw className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/review" className="w-full">
                <span className="font-medium">ふりかえり</span>
              </Link>
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
              src="/placeholder.svg?height=48&width=48"
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

      {/* メインコンテンツ - 振り返り登録フォーム */}
      <div className="flex-1 p-8 overflow-auto">
        {/* ユーザーID指定UI - こちらを内部に移動 */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputUserId}
              onChange={handleUserIdChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              placeholder="ユーザーID"
            />
            <button
              onClick={handleUserIdSubmit}
              className="bg-[#e88e67] text-white px-3 py-1 rounded-md text-sm hover:bg-[#d35f4d] transition-colors"
            >
              ID設定
            </button>
            <span className="text-sm text-gray-600">現在のID: {currentUserId}</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-8">振り返り</h1>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="mb-6 text-center">
            {/* <p className="text-lg">対話お疲れ様でした、こんなことがトピックスになっていました。</p>
            <p className="text-lg">この点には気づきはありましたか？</p> */}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e88e67]"></div>
              <span className="ml-3 text-gray-600">読み込み中...</span>
            </div>
          ) : (
            <div className="flex items-start mb-8">
              <div className="w-24 h-24 mr-4 flex-shrink-0">
                <Image
                  src="/images/robot-logo.svg"
                  alt="AIロボット"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="bg-gradient-to-r from-[#f8d3a8] to-[#e88e67] p-6 rounded-lg text-black mb-8">
                  <p className="mb-4">
                  <span className="font-medium">対話お疲れ様でした、パートナーのレポートではこんなことがトピックスになっていました。</span>
                  </p>
                  <p className="mb-4">
                    <span className="font-medium">良かったこと：</span>
                    {reminding.Goodthing_remind}
                  </p>
                  <p>
                    <span className="font-medium">気になっていること：</span>
                    {reminding.Badthing_remind}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              <p>レポートリマインドの取得に失敗しました: {error}</p>
              <button onClick={fetchReportReminding} className="mt-2 text-red-700 underline hover:text-red-900">
                再試行
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="planToDo" className="block text-lg font-medium mb-2">
                これからやろうと思うこと
              </label>
              <input
                id="planToDo"
                type="text"
                value={planToDo}
                onChange={(e) => setPlanToDo(e.target.value)}
                className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#e88e67] bg-transparent"
                placeholder="例：毎週金曜日は夜対話をする時間を確けることにする"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="notEnoughTalked" className="block text-lg font-medium mb-2">
                まだ話し足りないこと
              </label>
              <input
                id="notEnoughTalked"
                type="text"
                value={notEnoughTalked}
                onChange={(e) => setNotEnoughTalked(e.target.value)}
                className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#e88e67] bg-transparent"
                placeholder="例：復職後の保育園の送り迎えをどうするか"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className={`px-12 py-3 rounded-md text-white font-medium transition-colors ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#e88e67] hover:bg-[#d35f4d]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "送信中..." : "送信"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
