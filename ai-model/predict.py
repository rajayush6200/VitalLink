import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import sys
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "blood_infection_model.h5")

model = tf.keras.models.load_model(model_path)

img_path = sys.argv[1]

img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

prediction = model.predict(img_array, verbose=0)[0][0]

if prediction < 0.5:
    result = "infection"
else:
    result = "normal"

print(f"{result},{prediction}")
