const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");
const stopBtn = document.getElementById("stopBtn");
const audioPlayer = document.getElementById("audioPlayer");

let mediaRecorder;
let audioChunks = [];

function addMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerText = message;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  addMessage("Thinking...", "bot");
  userInput.value = "";

  try {
    const res = await fetch("/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    document.querySelector(".bot:last-child").remove(); // remove "Thinking..."
    addMessage(data.response, "bot");

    // Get voice response
    const audioRes = await fetch("/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: data.response }),
    });

    const { audio_url } = await audioRes.json();
    if (audio_url) {
      audioPlayer.src = audio_url;
      audioPlayer.play();
      stopBtn.style.display = "inline";
    }

  } catch (err) {
    console.error(err);
    addMessage("Something went wrong. Please try again.", "bot");
  }
}

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

micBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', blob, 'voice.wav');

    const res = await fetch('/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    userInput.value = data.text;
  };

  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 4000); // Record for 4s
});

stopBtn.addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  stopBtn.style.display = "none";
});
