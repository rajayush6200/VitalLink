import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# ---------------- CONFIG ----------------
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
MODEL_PATH = "blood_infection_model.h5"
VAL_DIR = "dataset/val"

# ---------------- LOAD MODEL ----------------
print("📦 Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)

# ---------------- LOAD VALIDATION DATA ----------------
print("📂 Loading validation data...")

val_gen = ImageDataGenerator(rescale=1./255)

val_data = val_gen.flow_from_directory(
    VAL_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    shuffle=False   # VERY IMPORTANT for correct evaluation
)

class_names = list(val_data.class_indices.keys())
print("✅ Class names:", class_names)

# ---------------- PREDICTIONS ----------------
print("🔍 Running predictions...")

y_true = val_data.classes
y_probs = model.predict(val_data)
y_pred = (y_probs > 0.5).astype(int).ravel()

# ---------------- METRICS ----------------
acc = accuracy_score(y_true, y_pred)

print("\n🎯 Accuracy:")
print(f"{acc * 100:.2f}%")

print("\n📊 Classification Report:")
print(classification_report(
    y_true,
    y_pred,
    target_names=class_names
))

print("\n🧮 Confusion Matrix:")
print(confusion_matrix(y_true, y_pred))
