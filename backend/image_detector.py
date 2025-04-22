# image_detector.py
import cv2
import numpy as np

def analyze_image(img_path):
    img = cv2.imread(img_path)
    # Dummy logic (you can replace with a model)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if np.mean(gray) < 100:
        return "Image seems dark, possibly underexposed or abnormal area."
    else:
        return "Image seems normal. No immediate anomalies."
