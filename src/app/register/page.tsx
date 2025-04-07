"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: '',
    surname: '',
    name: '',
    gender: '男性',
    birthday: '',
    personality: '',
    couple_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderSelect = (gender) => {
    setFormData({ ...formData, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          name: `${formData.surname} ${formData.name}`,
          user_id: Number(formData.user_id) // 数値に変換
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || '登録が完了しました');
        // 登録成功後、ログイン画面に遷移（3秒後）
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        // エラーメッセージがオブジェクトの場合に対応
        setError(
          Array.isArray(data.detail) 
            ? data.detail.map(err => err.msg).join(', ') 
            : data.detail || 'エラーが発生しました'
        );
      }
    } catch (error) {
      console.error(error);
      setError('サーバーとの通信中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <div className="w-[320px] bg-white p-8 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <Image 
            src="/images/robot-logo.svg" 
            alt="AIさんのアイコン" 
            width={40} 
            height={40}
          />
          <span className="text-xl font-medium">ふたりのAIさん</span>
        </Link>
        
        <div className="flex-grow">
          {/* サイドバーコンテンツ */}
        </div>
        
        <div className="mt-auto text-sm text-gray-500">
          <div className="flex gap-6">
            <Link href="/about" className="hover:underline">このアプリについて</Link>
            <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex-1 bg-[#fdf6ed] p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium mb-2">あなたのことを教えてください</h1>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-lg mb-4">おなまえ</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="名前"
                    className="flex-1 p-3 border border-gray-200 rounded-md"
                    required
                  />
                
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-4">性別</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleGenderSelect('男')}
                    className={`flex-1 p-3 border rounded-md ${
                      formData.gender === '男' 
                        ? 'bg-[#e07a5f] text-white border-[#e07a5f]' 
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    男性
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderSelect('女')}
                    className={`flex-1 p-3 border rounded-md ${
                      formData.gender === '女' 
                        ? 'bg-[#e07a5f] text-white border-[#e07a5f]' 
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    女性
                  </button>
                 
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-4">誕生日</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-4">性格(MBTI)</label>
                <input
                  type="text"
                  name="personality"
                  value={formData.personality}
                  onChange={handleChange}
                  placeholder="例: INFJ"
                  className="w-full p-3 border border-gray-200 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-4">ユーザーID</label>
                <input
                  type="number"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  placeholder="数字を入力"
                  className="w-full p-3 border border-gray-200 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-4">夫婦ID</label>
                <input
                  type="text"
                  name="couple_id"
                  value={formData.couple_id}
                  onChange={handleChange}
                  placeholder="夫婦IDを入力"
                  className="w-full p-3 border border-gray-200 rounded-md"
                  required
                />
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#e07a5f] hover:bg-[#d86c51] text-white py-3 px-12 rounded-md disabled:opacity-70"
                >
                  {loading ? '登録中...' : '登録する'}
                </button>
              </div>
            </form>
            
            {message && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-[#e07a5f] hover:underline ml-1">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
