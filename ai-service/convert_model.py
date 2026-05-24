import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import tensorflow as tf

model_path = "blood_infection_model.h5"
new_model_path = "blood_infection_model.keras"

print(f"Loading {model_path}...")
model = tf.keras.models.load_model(model_path)

print(f"Saving to {new_model_path}...")
model.save(new_model_path)
print("Done!")
