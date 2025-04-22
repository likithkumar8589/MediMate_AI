import os
import pyttsx3
import uuid
import speech_recognition as sr
import tempfile

# 1. Voice-to-Text
def transcribe_audio(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand the audio."
        except sr.RequestError:
            return "Sorry, the speech recognition service is down."

# 2. Text-to-Voice
def generate_voice_response(text):
    engine = pyttsx3.init()
    temp_filename = f"{uuid.uuid4()}.mp3"
    output_path = os.path.join("static", "uploads", temp_filename)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    engine.save_to_file(text, output_path)
    engine.runAndWait()
    
    return output_path
