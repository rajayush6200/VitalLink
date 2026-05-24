import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf

model_path = "blood_infection_model.keras" # Use the successfully converted local keras model
tflite_model_path = "blood_infection_model.tflite"

print(f"Loading {model_path} for TFLite conversion...")
model = tf.keras.models.load_model(model_path)

print("Converting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

print(f"Saving to {tflite_model_path}...")
with open(tflite_model_path, "wb") as f:
    f.write(tflite_model)

print("TFLite conversion complete!")
