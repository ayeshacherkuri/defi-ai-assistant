import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅

from dotenv import load_dotenv
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("Using API Key:", OPENROUTER_API_KEY[:10] + "...")

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "")
        if not user_message:
            return jsonify({"reply": "Error: No message provided"}), 400

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistralai/mistral-7b-instruct",  # ✅ Working model
            "messages": [{"role": "user", "content": user_message}],
            "temperature": 0.7
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )

        if response.status_code != 200:
            return jsonify({"reply": f"OpenRouter Error: {response.status_code} - {response.text}"}), 500

        res_data = response.json()

        if "choices" in res_data and len(res_data["choices"]) > 0:
            ai_reply = res_data["choices"][0]["message"]["content"]
            return jsonify({"reply": ai_reply})
        else:
            return jsonify({"reply": "OpenRouter Error: 'choices' missing in response"}), 500

    except Exception as e:
        return jsonify({"reply": f"Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
