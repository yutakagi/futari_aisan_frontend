"use client"

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    gender: '男',
    birthday: '',
    personality: '',
    couple_id: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://app-002-step3-2-py-oshima10.azurewebsites.net/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          user_id: Number(formData.user_id) // 数値に変換
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.detail || 'エラーが発生しました');
      }
    } catch (error) {
      console.error(error);
      setMessage('エラーが発生しました');
    }
  };

  return (
    <div>
      <h1>新規ユーザー登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザーID: </label>
          <input
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>名前: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>性別: </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label>誕生日: </label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>性格(MBTI): </label>
          <input
            type="text"
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>夫婦ID: </label>
          <input
            type="text"
            name="couple_id"
            value={formData.couple_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
