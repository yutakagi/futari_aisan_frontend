"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください")
      return
    }
    
    setIsLoading(true)
    
    try {
      // ログイン処理の仮実装
      // 実際にはAPI呼び出しなどを行う
      setTimeout(() => {
        router.push("/dashboard") // /dashboard に遷移するよう変更
      }, 1000)
    } catch (err) {
      console.error("ログインエラー:", err)
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* 左側: ログインフォーム */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-12">
            <div className="w-12 h-12 mr-2">
              <Image 
                src="/images/robot-logo.svg" 
                alt="AIロボットロゴ" 
                width={48} 
                height={48} 
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-medium">ふたりのAIさん</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-8 text-center">ログイン</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@tech0.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e88e67]"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#f8d3a8] to-[#e88e67] hover:from-[#e88e67] hover:to-[#d35f4d]"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
          
          <div className="flex justify-between mt-6 text-sm">
            <Link href="/register" className="text-gray-600 hover:text-[#e88e67]">
              新規会員登録
            </Link>
          </div>
        </div>
      </div>
      
      {/* 右側: イラストと説明文 */}
      <div className="w-1/2 bg-[#fdf6e3] flex flex-col items-center justify-center p-8 relative">

        
        <div className="max-w-md">
          <Image
            src="/images/family-gift.png"
            alt="家族のイラスト"
            width={400}
            height={400}
            className="object-contain mb-8"
          />
          
          <p className="text-center text-lg">
            夫婦が対話を習慣化するAIエージェントアプリ
          </p>
        </div>
      </div>
    </div>
  )
}
