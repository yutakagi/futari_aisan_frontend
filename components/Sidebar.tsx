import { LayoutGrid, MessageCircle, RotateCcw, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar({ userName }) {
  return (
    <div className="w-64 bg-white p-6 flex flex-col">
      {/* ロゴ部分 */}
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

      {/* ナビゲーション */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {[
            { icon: LayoutGrid, label: "ダッシュボード" },
            { icon: MessageCircle, label: "今日のあのね！", active: true },
            { icon: RotateCcw, label: "ふりかえり" },
            { icon: Settings, label: "設定" },
          ].map(({ icon: Icon, label, active }) => (
            <li
              key={label}
              className={`flex items-center p-2 rounded ${
                active ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 mr-3 text-gray-500" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* ユーザープロフィール */}
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
  );
}
