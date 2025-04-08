import Image from "next/image";

export default function ChatHistory({ chatHistory, chatContainerRef, isLoading }) {
  return (
    <div ref={chatContainerRef} className="bg-white rounded-lg p-6 h-full overflow-y-auto shadow-sm">
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
          </div>
        ))}
      </div>

      {chatHistory.length === 0 && !isLoading && (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">会話を始めましょう</p>
        </div>
      )}

      {isLoading && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10">
          処理中...
        </div>
      )}
    </div>
  );
}
