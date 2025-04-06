"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, User, Calendar, Settings } from "lucide-react";
import { useReflection } from "./hooks/useReflection";

export default function Home() {
  const {
    futurePlans,
    setFuturePlans,
    wantToDiscuss,
    setWantToDiscuss,
    isLoading,
    response,
    error,
    handleSubmit,
  } = useReflection();

  return (
    <div className="app-container">
      {/* サイドバー */}
      <aside className="sidebar">
      <div className="sidebar-header">
          <Link href="/" className="logo-container" style={{ display: "flex", alignItems: "center" }}>
            {/* アイコンを「ai-icon.svg」に変更 */}
            <div className="logo-icon" style={{ marginRight: "8px" }}>
              <Image
                src="/images/ai-icon.svg"
                alt="AIさんのアイコン"
                width={32}
                height={32}
                priority
              />
            </div>
            {/* フォント適用 */}
            <span className="logo-text" style={{ fontFamily: "Zen Maru Gothic", fontSize: "20px", fontWeight: "bold" }}>
              ふたりのAIさん
            </span>
          </Link>
        </div>


        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/dashboard">
                <LayoutGrid size={20} />
                <span>ダッシュボード</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/today">
                <User size={20} />
                <span>今日のあのね</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link href="/reflection">
                <Calendar size={20} />
                <span>ふりかえり</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings">
                <Settings size={20} />
                <span>設定</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar"></div>
            <div className="username">斉藤俊輔</div>
          </div>
        </div>
      </aside>


      {/* メインコンテンツ */}
      <main className="main-content">
      <h1 className="page-title">振り返り</h1>

      <div className="reflection-card">
      <div className="card-header">
      <div className="ai-avatar">
      <div className="ai-icon">
      <Image src="/images/ai-icon.svg" alt="AIさんのアイコン" width={128} height={128} priority />
      </div>
      <p className="ai-name">AIさん</p>
      </div>

      <div className="card-message">
      <p className="message-title">今回の対話はどうでしたか？</p>
      <p className="message-subtitle">これからやろうと思うことともっと話したいことがあれば入力してください</p>
      </div>
      </div>

      <form className="reflection-form" onSubmit={handleSubmit}>
      <div>
      <input
      type="text"
      placeholder="これからやろうと思うこと"
      className="form-input"
      value={futurePlans}
      onChange={(e) => setFuturePlans(e.target.value)}
      required
      />
      </div>

      <div>
      <input
      type="text"
      placeholder="まだ話し足りないこと"
      className="form-input"
      value={wantToDiscuss}
      onChange={(e) => setWantToDiscuss(e.target.value)}
      required
      />
      </div>

      <div className="form-submit">
      <button
      type="submit"
      className="submit-button"
      disabled={isLoading}
      >
      {isLoading ? "送信中..." : "送信"}
      </button>
      </div>
      </form>


          {/* API応答表示 */}
          {response && (
            <pre style={{ backgroundColor: "#e6f7e6", padding: "10px" }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}

          {/* エラー表示 */}
          {error && (
            <p style={{ color: "#cc0000", backgroundColor: "#ffeeee", padding: "10px" }}>
              エラーが発生しました: {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
