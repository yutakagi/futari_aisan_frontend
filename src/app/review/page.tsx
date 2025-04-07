"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { LayoutGrid, MessageCircle, RotateCcw, Settings } from 'lucide-react'

export default function ReviewPage() {
  const [isClient, setIsClient] = useState(false)
  const [userName, setUserName] = useState('斎藤 俊輔')
  const [userId, setUserId] = useState('1')
  const [partnerName, setPartnerName] = useState('美海')
  
  // 振り返りデータ
  const [reviews, setReviews] = useState([
    {
      id: 1,
      date: "2025/03/21",
      person: "美海",
      profileImage: "/placeholder.svg?height=80&width=80",
      planToDo: "毎週金曜日は夜対話をする時間を確けることにする。お酒を飲みながらざっくばらんと一週間を振り返る時間を作る。",
      notEnoughTalked: "復職後の保育園の送り迎えをどうするか、テレワークをうまく活用して分担したいので引き続き話す。"
    },
    {
      id: 2,
      date: "2025/03/15",
      person: "俊輔",
      profileImage: "/placeholder.svg?height=80&width=80",
      planToDo: "週末は家族で過ごす時間を大切にする。特に日曜日の午前中は子どもと公園に行く時間を確保する。",
      notEnoughTalked: "今後のキャリアプランについてもう少し具体的に話し合いたい。特に転職の可能性について。"
    }
  ])

  // クライアントサイドでのみレンダリングを行うためのフラグ
  useEffect(() => {
    setIsClient(true)
  }, [])

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
              <Link href="/dashboard" className="w-full">ダッシュボード</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/conversation" className="w-full">今日のあのね！</Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-100">
              <RotateCcw className="w-5 h-5 mr-3 text-gray-500" />
              <Link href="/review" className="w-full">レビュー</Link>
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

      {/* メインコンテンツ - ふりかえり */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-8">ふりかえり</h1>

        {/* 振り返りカード */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={review.profileImage || "/placeholder.svg"}
                    alt={`${review.person}さんのプロフィール`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-medium">
                  {review.date} {review.person}さんの対話振り返り
                </h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-3">これからやろうと思うこと</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {review.planToDo}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-3">まだ話し足りないこと</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {review.notEnoughTalked}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
