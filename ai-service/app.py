import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import tempfile

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "blood_infection_model.h5")

model = tf.keras.models.load_model(model_path)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    img_file = request.files["image"]

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        img_file.save(tmp.name)
        img = image.load_img(tmp.name, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

    prediction = model.predict(img_array, verbose=0)[0][0]

    result = "infected" if prediction < 0.5 else "normal"

    return jsonify({
        "result": result,
        "confidence": float(prediction)
    })

@app.route("/", methods=["GET"])
def health():
    return "AI service running"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
app.run(host="0.0.0.0", port=port)

