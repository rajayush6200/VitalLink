import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import base64
from io import BytesIO
import tempfile

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "blood_infection_model.tflite")

interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    if not data or "imageBase64" not in data:
        return jsonify({"error": "No imageBase64 provided"}), 400

    try:
        img_data = base64.b64decode(data["imageBase64"])
        img = image.load_img(BytesIO(img_data), target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0).astype(np.float32) / 255.0

        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()
        prediction = interpreter.get_tensor(output_details[0]['index'])[0][0]
        result = "infected" if prediction < 0.5 else "normal"

        return jsonify({
            "result": result,
            "confidence": float(prediction)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return "AI service running"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)

