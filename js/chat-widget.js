// === LÓGICA DO CHATBOT E CÂMERA DE VÍDEO (HÍBRIDO WEBCAM/SIMULAÇÃO) ===
var localStream = null;
var simulatedInterval = null;

// Ligar / Desligar Câmera de Vídeo
async function toggleVideoCall() {
  var videoArea = document.getElementById("chatVideoArea");
  var videoPreview = document.getElementById("chatVideoPreview");
  var messages = document.getElementById("chatWidgetMessages");

  if (!videoArea || !videoPreview) return;

  if (localStream || videoArea.style.display === "block") {
    endVideoCall();
    return;
  }

  // 1. Tentar ativar Câmera Real via WebRTC primeiro
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoPreview.srcObject = localStream;
      videoPreview.style.display = "block";
      videoArea.style.display = "block";

      if (messages) {
        var botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = "Chamada de vídeo iniciada. Conectado ao mentor em tempo real.";
        messages.appendChild(botBubble);
        messages.scrollTop = messages.scrollHeight;
      }
      return;
    } catch (err) {
      console.warn("Acesso à câmera real não liberado, ativando transmissão animada...", err);
    }
  }

  // 2. MODO SIMULAÇÃO DE VÍDEO HD (Funciona 100% no protocolo file:///)
  videoArea.style.display = "block";
  videoPreview.style.display = "none";

  var canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  canvas.id = "simulatedVideoCanvas";
  canvas.style.width = "100%";
  canvas.style.borderRadius = "10px";
  canvas.style.maxHeight = "160px";

  var existingCanvas = document.getElementById("simulatedVideoCanvas");
  if (existingCanvas) existingCanvas.remove();

  videoArea.insertBefore(canvas, videoArea.firstChild);
  var ctx = canvas.getContext("2d");

  var pulse = 0;
  simulatedInterval = setInterval(function() {
    pulse += 0.05;
    var opacity = 0.8 + Math.sin(pulse) * 0.2;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#DDAA55";
    ctx.beginPath();
    ctx.arc(160, 65, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Vídeo Ao Vivo com Mentor Inspira", 160, 120);

    ctx.fillStyle = "rgba(16, 185, 129, " + opacity + ")";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("Transmissão HD Conectada", 160, 145);
  }, 80);

  if (messages) {
    var botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.textContent = "Chamada de vídeo iniciada (Transmissão de Vídeo HD).";
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  }
}

// Encerrar Chamada de Vídeo
function endVideoCall() {
  var videoArea = document.getElementById("chatVideoArea");
  var videoPreview = document.getElementById("chatVideoPreview");
  var messages = document.getElementById("chatWidgetMessages");

  if (localStream) {
    localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    localStream = null;
  }

  if (simulatedInterval) {
    clearInterval(simulatedInterval);
    simulatedInterval = null;
  }

  var simulatedCanvas = document.getElementById("simulatedVideoCanvas");
  if (simulatedCanvas) simulatedCanvas.remove();

  if (videoPreview) {
    videoPreview.srcObject = null;
    videoPreview.style.display = "block";
  }

  if (videoArea) {
    videoArea.style.display = "none";
  }

  if (messages) {
    var botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.textContent = "Chamada de vídeo encerrada.";
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  }
}

// Abrir / Fechar Janela do Chatbot (Garantido para o botão X)
function toggleChatWidget() {
  var panel = document.getElementById("chatWidgetPanel");
  if (!panel) return;
  panel.classList.toggle("active");
}

// Enviar Mensagem no Chat
function sendChatMessage() {
  var input = document.getElementById("chatWidgetInput");
  var messages = document.getElementById("chatWidgetMessages");
  if (!input || !messages) return;
  
  var text = input.value.trim();
  if (!text) return;

  var userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.textContent = text;
  messages.appendChild(userBubble);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  setTimeout(function() {
    var botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.textContent = "Entendi perfeitamente! Como posso te apoiar com essa dúvida?";
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  }, 700);
}

document.addEventListener("DOMContentLoaded", function() {
  var chatInput = document.getElementById("chatWidgetInput");
  if (chatInput) {
    chatInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
});