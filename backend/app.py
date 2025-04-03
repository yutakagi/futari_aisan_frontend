### app.py ###
import os
import logging
import uuid
import json
from datetime import datetime, date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from database import SessionLocal, engine, Base
from models import User,UserAnswer,ConversationHistory, StructuredAnswer  # 他のモデル（User, Couple）は必要に応じてインポート
from conversation import create_conversation_chain
from structured_parser import extract_structured_data

load_dotenv()

# テーブル作成（存在しない場合のみ）
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# プロトタイプ用のセッション管理（メモリ上の辞書）
sessions = {}

class ChatRequest(BaseModel):
    user_id: str
    session_id: str = None
    answer: str = None

class ChatResponse(BaseModel):
    session_id: str
    feedback: str = None
    round: int
    message: str = None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    db = SessionLocal()
    try:
        if not request.session_id:
            # 新規セッション開始時にユーザー情報・パートナー情報を取得
            user = db.query(User).filter(User.user_id == request.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="ユーザー情報が見つかりません。")
            # 自分以外で同じcouple_idのユーザーを取得
            partner = db.query(User).filter(
                User.couple_id == user.couple_id,
                User.user_id != user.user_id
            ).first()  

            # パートナーが見つからない場合はNone（create_conversation_chain内で「情報なし」に置換）
            session_id = str(uuid.uuid4())
            chain = create_conversation_chain(user,partner)
            sessions[session_id] = chain
            initial_input = "セッション開始"
            response = chain.predict(input=initial_input)
            return ChatResponse(
                session_id=session_id,
                feedback=response,
                round=1,
                message="セッションを開始しました。"
            )
        else:
            # 既存セッションの場合
            session_id = request.session_id
            if session_id not in sessions:
                raise HTTPException(status_code=400, detail="セッションが存在しません。")
            chain = sessions[session_id]
            if not request.answer:
                raise HTTPException(status_code=400, detail="回答が入力されていません。")
            # ラウンド番号を会話履歴から計算（例：単純にメッセージ数から算出）
            round_number = len(chain.memory.chat_memory.messages) // 2 + 1
            user_answer = UserAnswer(
                user_id=request.user_id,
                session_id=session_id,
                round_number=round_number,
                user_question=request.answer
            )
            db.add(user_answer)
            db.commit()
            response = chain.predict(input=request.answer)
            return ChatResponse(
                session_id=session_id,
                feedback=response,
                round=round_number,
                message=""
            )
    except Exception as e:
        logger.exception("Error in chat endpoint")
        raise HTTPException(status_code=500, detail="チャット処理中にエラーが発生しました。")
    finally:
        db.close()

@app.get("/")
async def hello():
    return {"message": "FastAPI Conversational Coaching Session Prototype using ConversationChain"}

@app.post("/save_conversation")
async def save_conversation(session_id: str, user_id: str):
    db = SessionLocal()
    try:
        # セッションの存在確認
        if session_id not in sessions:
            raise HTTPException(status_code=400, detail="セッションが存在しません。")
        chain = sessions[session_id]
        # インメモリのチャット履歴から、各メッセージの内容を連結
        chat_history = "\n".join([msg.content for msg in chain.memory.chat_memory.messages])

        # ConversationHistoryに保存
        conv_history = ConversationHistory(
            user_id=user_id,
            session_id=session_id,
            chat_history=chat_history
        )
        db.add(conv_history)
        db.commit()
        db.refresh(conv_history)

        # StructuredOutputParserで構造化データに変換
        structured_data = extract_structured_data(chat_history)

        # StructuredAnswerに保存（JSON文字列として保存する例）
        structured_answer = StructuredAnswer(
            conversation_history_id=conv_history.id,
            user_id=user_id, 
            answer_summary=json.dumps(structured_data,ensure_ascii=False)
        )
        db.add(structured_answer)
        db.commit()

        return{"message":"会話履歴と構造化データの保存に成功しました。"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="保存中にエラーが発生しました")
    finally:
        db.close()