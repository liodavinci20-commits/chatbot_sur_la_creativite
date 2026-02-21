# app.py
# Serveur Flask API pour le chatbot créativité — 100% local, sans API externe

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from chatbot_engine import ChatbotEngine
from lessons_data import LESSONS, FINAL_CHALLENGE
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "chatbot-secret-default")

# CORS: autoriser le frontend local + le frontend Vercel en production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5000").split(",")
CORS(app, supports_credentials=True, origins=allowed_origins)


# Initialiser le moteur du chatbot
chatbot = ChatbotEngine()


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    name = data.get("name", "").strip()
    classe = data.get("classe", "").strip()

    if not name or not classe:
        return jsonify({"error": "Nom et classe requis"}), 400

    session["student_name"] = name
    session["student_class"] = classe
    session["progress"] = {key: False for key in LESSONS}
    session["final_complete"] = False
    session["chat_history"] = []
    session["conversation_state"] = {"current_topic": None, "state": "idle"}

    return jsonify({"success": True, "name": name, "classe": classe})


@app.route("/api/chat", methods=["POST"])
def chat():
    if "student_name" not in session:
        return jsonify({"error": "Non connecté"}), 401

    data = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"error": "Message vide"}), 400

    student_name = session["student_name"]
    student_class = session["student_class"]
    progress = session.get("progress", {})
    chat_history = session.get("chat_history", [])
    conversation_state = session.get("conversation_state", {"current_topic": None, "state": "idle"})

    chat_history.append({"role": "user", "content": message})

    result = chatbot.get_response(
        message=message,
        student_name=student_name,
        student_class=student_class,
        progress=progress,
        chat_history=chat_history[-20:],
        conversation_state=conversation_state
    )

    chat_history.append({"role": "assistant", "content": result["response"]})
    session["chat_history"] = chat_history
    session["conversation_state"] = result.get("conversation_state", conversation_state)

    if result["completed_topic"] and result["completed_topic"] in progress:
        progress[result["completed_topic"]] = True
        session["progress"] = progress

    if result["final_complete"]:
        session["final_complete"] = True

    all_completed = all(progress.get(k, False) for k in LESSONS)

    return jsonify({
        "response": result["response"],
        "completed_topic": result["completed_topic"],
        "final_complete": result["final_complete"],
        "all_completed": all_completed,
        "progress": progress
    })


@app.route("/api/progress", methods=["GET"])
def get_progress():
    if "student_name" not in session:
        return jsonify({"error": "Non connecté"}), 401

    return jsonify({
        "progress": session.get("progress", {}),
        "all_completed": all(session.get("progress", {}).get(k, False) for k in LESSONS),
        "final_complete": session.get("final_complete", False)
    })


@app.route("/api/welcome", methods=["GET"])
def welcome():
    if "student_name" not in session:
        return jsonify({"error": "Non connecté"}), 401

    welcome_msg = chatbot.get_welcome_message(session["student_name"])
    return jsonify({"message": welcome_msg})


@app.route("/api/topics", methods=["GET"])
def get_topics():
    if "student_name" not in session:
        return jsonify({"error": "Non connecté"}), 401

    progress = session.get("progress", {})
    topics = []
    for key, lesson in LESSONS.items():
        topics.append({
            "id": key,
            "title": lesson["title"],
            "icon": lesson["icon"],
            "order": lesson["order"],
            "completed": progress.get(key, False)
        })
    topics.sort(key=lambda x: x["order"])

    return jsonify({
        "topics": topics,
        "student_name": session["student_name"],
        "student_class": session["student_class"],
        "all_completed": all(progress.get(k, False) for k in LESSONS),
        "final_complete": session.get("final_complete", False)
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
