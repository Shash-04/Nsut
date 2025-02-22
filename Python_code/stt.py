import os
import torch
import pyaudio
import wave
import numpy as np
from transformers import WhisperProcessor, WhisperForConditionalGeneration
 
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
 
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny.en")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny.en")
 
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000   
CHUNK = 1024   
RECORD_SECONDS = 10  
 
audio = pyaudio.PyAudio()
 
stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

print("\n🎤 **Start speaking...** (Recording for {} seconds)".format(RECORD_SECONDS))
frames = []

for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)

print("🛑 Recording Stopped.\n")

stream.stop_stream()
stream.close()
audio.terminate()
 
wav_filename = "recorded_audio.wav"
wf = wave.open(wav_filename, "wb")
wf.setnchannels(CHANNELS)
wf.setsampwidth(audio.get_sample_size(FORMAT))
wf.setframerate(RATE)
wf.writeframes(b"".join(frames))
wf.close()
 
audio_data = np.frombuffer(b"".join(frames), dtype=np.int16).astype(np.float32) / 32768.0   
 
input_features = processor(audio_data, sampling_rate=RATE, return_tensors="pt")
 
with torch.no_grad():
    predicted_ids = model.generate(input_features.input_features)

transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

print("\n📝 **Transcription:**", transcription)
