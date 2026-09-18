// ============================================
// CHATBOT INSPIRA AI — Lógica do Chat e Vídeo
// Mentor de tecnologia com respostas inteligentes
// ============================================

var localStream = null;
var simulatedInterval = null;

// === RESPOSTAS INTELIGENTES DO BOT ===
// Baseado na persona do DIO Agent: mentor paciente, claro e encorajador
var respostasBot = [
  {
    palavras: ["currículo", "curriculo", "cv", "ats", "vaga", "emprego"],
    resposta: "Sobre currículos, o Analisador ATS da Inspira pode te ajudar a otimizar o seu! Quer que eu te direcione para a ferramenta? 📄"
  },
  {
    palavras: ["mentor", "mentoria", "orientação", "orientacao"],
    resposta: "A DIO tem sessões de mentoria ao vivo com especialistas! Você pode levar suas dúvidas e receber orientação direta. Quer saber como participar? 🎯"
  },
  {
    palavras: ["bootcamp", "trilha", "formação", "formacao", "curso"],
    resposta: "Os Bootcamps da DIO são experiências completas e gratuitas, patrocinadas por grandes empresas! Posso te ajudar a escolher o melhor para seus objetivos. O que você quer aprender? 🚀"
  },
  {
    palavras: ["power bi", "powerbi", "dashboard", "dados", "análise de dados", "analise de dados"],
    resposta: "Power BI é uma ferramenta incrível para análise de dados! Na seção de Recursos temos uma Masterclass sobre Modelagem de Dados. Quer conferir? 📊"
  },
  {
    palavras: ["sql", "banco de dados", "database", "query", "consulta"],
    resposta: "SQL é essencial para trabalhar com dados! Temos desafios práticos com banco de dados de testes na área de Recursos. Bora praticar? 💾"
  },
  {
    palavras: ["figma", "design", "ux", "ui", "interface", "prototipo", "protótipo"],
    resposta: "Para UX/UI, temos templates no padrão Google! Você pode duplicar no Figma e já começar a prototipar. Está na seção de Recursos. 🎨"
  },
  {
    palavras: ["python", "javascript", "java", "programação", "programacao", "código", "codigo", "html", "css"],
    resposta: "Programação é uma jornada e cada pessoa aprende no seu ritmo! A DIO tem bootcamps e cursos práticos. Me conta: você é iniciante ou já tem experiência? 💻"
  },
  {
    palavras: ["ajuda", "dúvida", "duvida", "como", "o que", "onde", "qual"],
    resposta: "Claro, estou aqui para te ajudar! Me conta com mais detalhes o que você precisa e eu te direciono. 😊"
  },
  {
    palavras: ["obrigada", "obrigado", "valeu", "thanks", "agradeço"],
    resposta: "Disponha! Fico feliz em ajudar. Se precisar de mais alguma coisa, é só chamar! 💛"
  },
  {
    palavras: ["oi", "olá", "ola", "hey", "eai", "e aí", "bom dia", "boa tarde", "boa noite"],
    resposta: "Olá! 👋 Que bom te ver por aqui! Como posso te ajudar hoje? Posso te orientar sobre cursos, bootcamps, recursos ou carreira em tech!"
  },
  {
    palavras: ["video", "vídeo", "chamada", "câmera", "camera", "ligar"],
    resposta: "Você pode iniciar uma videochamada clicando no ícone da câmera ao lado do campo de mensagem! 📹"
  },
  {
    palavras: ["carreira", "profissão", "profissao", "mercado", "trabalho", "estágio", "estagio"],
    resposta: "Pensar na carreira é muito importante! A DIO te conecta com empresas parceiras através de bootcamps. Que área de tecnologia te interessa mais? 🎯"
  },
  {
    palavras: ["aws", "cloud", "nuvem", "azure", "gcp"],
    resposta: "Cloud computing é uma das áreas que mais cresce! AWS, Azure e GCP são as principais plataformas. A DIO tem bootcamps específicos de cloud. Quer explorar? ☁️"
  },
  {
    palavras: ["certificado", "certificação", "certificacao", "diploma"],
    resposta: "Ao concluir bootcamps e formações na DIO, você recebe certificados! Eles são ótimos para o seu portfólio e LinkedIn. 🏆"
  }
];

// Resposta padrão quando não encontra correspondência
var respostasPadrao = [
  "Entendi! Posso te ajudar com bootcamps, cursos, mentoria, ferramentas de carreira ou qualquer dúvida sobre tecnologia. Me conta mais! 😊",
  "Interessante! Quer que eu te mostre os recursos disponíveis ou prefere falar sobre algum tema específico? 🚀",
  "Estou aqui para te apoiar! Posso te orientar sobre cursos da DIO, carreira em tech ou ferramentas de estudo. O que prefere? 💡",
  "Legal! Se precisar de ajuda com algo específico — como bootcamps, SQL, Power BI ou carreira — é só me falar! 🎯"
];

// Encontrar a melhor resposta para a mensagem do usuário
function encontrarResposta(mensagem) {
  var textoLower = mensagem.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (var i = 0; i < respostasBot.length; i++) {
    var grupo = respostasBot[i];
    for (var j = 0; j < grupo.palavras.length; j++) {
      var palavra = grupo.palavras[j].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (textoLower.indexOf(palavra) !== -1) {
        return grupo.resposta;
      }
    }
  }
  
  // Resposta aleatória do conjunto padrão
  var indice = Math.floor(Math.random() * respostasPadrao.length);
  return respostasPadrao[indice];
}


// === ABRIR / FECHAR PAINEL DO CHAT ===
function toggleChatWidget() {
  var panel = document.getElementById("chatWidgetPanel");
  var fab = document.getElementById("chatFabBtn");
  if (!panel) return;
  
  var estaAberto = panel.classList.contains("active");
  
  if (estaAberto) {
    panel.classList.remove("active");
    if (fab) fab.style.display = "flex";
  } else {
    panel.classList.add("active");
    if (fab) fab.style.display = "none";
    
    // Focar no input ao abrir
    setTimeout(function() {
      var input = document.getElementById("chatWidgetInput");
      if (input) input.focus();
    }, 350);
  }
}


// === ENVIAR MENSAGEM NO CHAT ===
function sendChatMessage() {
  var input = document.getElementById("chatWidgetInput");
  var messages = document.getElementById("chatWidgetMessages");
  if (!input || !messages) return;

  var texto = input.value.trim();
  if (!texto) return;

  // Criar bolha do usuário
  var bolhaUser = document.createElement("div");
  bolhaUser.className = "chat-bubble user";
  bolhaUser.textContent = texto;
  messages.appendChild(bolhaUser);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  // Indicador de "digitando..."
  var bolhaDigitando = document.createElement("div");
  bolhaDigitando.className = "chat-bubble bot digitando";
  bolhaDigitando.textContent = "Digitando";
  messages.appendChild(bolhaDigitando);
  messages.scrollTop = messages.scrollHeight;

  // Resposta do bot com pequeno atraso para parecer natural
  var tempoResposta = 600 + Math.random() * 800;
  setTimeout(function() {
    // Remover indicador de digitação
    if (bolhaDigitando.parentNode) {
      bolhaDigitando.parentNode.removeChild(bolhaDigitando);
    }

    // Criar bolha do bot com resposta inteligente
    var bolhaBot = document.createElement("div");
    bolhaBot.className = "chat-bubble bot";
    bolhaBot.textContent = encontrarResposta(texto);
    messages.appendChild(bolhaBot);
    messages.scrollTop = messages.scrollHeight;
  }, tempoResposta);
}


// === VIDEOCHAMADA: LIGAR / DESLIGAR CÂMERA ===
async function toggleVideoCall() {
  var videoArea = document.getElementById("chatVideoArea");
  var videoPreview = document.getElementById("chatVideoPreview");
  var messages = document.getElementById("chatWidgetMessages");

  if (!videoArea || !videoPreview) return;

  // Se já está em chamada, encerrar
  if (localStream || videoArea.style.display === "block") {
    endVideoCall();
    return;
  }

  // 1. Tentar ativar Câmera Real via WebRTC
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoPreview.srcObject = localStream;
      videoPreview.style.display = "block";
      videoArea.style.display = "block";

      if (messages) {
        var bolhaBot = document.createElement("div");
        bolhaBot.className = "chat-bubble bot";
        bolhaBot.textContent = "📹 Chamada de vídeo iniciada! Conectado ao mentor em tempo real.";
        messages.appendChild(bolhaBot);
        messages.scrollTop = messages.scrollHeight;
      }
      return;
    } catch (erro) {
      console.warn("Câmera real não disponível, ativando modo de simulação...", erro);
    }
  }

  // 2. MODO SIMULAÇÃO (funciona no protocolo file:///)
  videoArea.style.display = "block";
  videoPreview.style.display = "none";

  var canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  canvas.id = "simulatedVideoCanvas";
  canvas.style.width = "100%";
  canvas.style.borderRadius = "12px";
  canvas.style.maxHeight = "160px";

  var canvasExistente = document.getElementById("simulatedVideoCanvas");
  if (canvasExistente) canvasExistente.remove();

  videoArea.insertBefore(canvas, videoArea.firstChild);
  var ctx = canvas.getContext("2d");

  var pulso = 0;
  simulatedInterval = setInterval(function() {
    pulso += 0.05;
    var opacidade = 0.8 + Math.sin(pulso) * 0.2;

    // Fundo escuro
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ícone do avatar
    ctx.fillStyle = "#DDAA55";
    ctx.beginPath();
    ctx.arc(160, 60, 28, 0, Math.PI * 2);
    ctx.fill();

    // Iniciais no avatar
    ctx.fillStyle = "#0b0e17";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IA", 160, 60);

    // Texto principal
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Vídeo Ao Vivo com Mentor Inspira", 160, 115);

    // Status da conexão com animação
    ctx.fillStyle = "rgba(16, 185, 129, " + opacidade + ")";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("● Transmissão HD Conectada", 160, 140);
  }, 80);

  if (messages) {
    var bolhaBot = document.createElement("div");
    bolhaBot.className = "chat-bubble bot";
    bolhaBot.textContent = "📹 Chamada de vídeo iniciada (Transmissão de Vídeo HD simulada).";
    messages.appendChild(bolhaBot);
    messages.scrollTop = messages.scrollHeight;
  }
}


// === ENCERRAR CHAMADA DE VÍDEO ===
function endVideoCall() {
  var videoArea = document.getElementById("chatVideoArea");
  var videoPreview = document.getElementById("chatVideoPreview");
  var messages = document.getElementById("chatWidgetMessages");

  // Parar câmera real
  if (localStream) {
    localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    localStream = null;
  }

  // Parar simulação
  if (simulatedInterval) {
    clearInterval(simulatedInterval);
    simulatedInterval = null;
  }

  var canvasSimulado = document.getElementById("simulatedVideoCanvas");
  if (canvasSimulado) canvasSimulado.remove();

  if (videoPreview) {
    videoPreview.srcObject = null;
    videoPreview.style.display = "block";
  }

  if (videoArea) {
    videoArea.style.display = "none";
  }

  if (messages) {
    var bolhaBot = document.createElement("div");
    bolhaBot.className = "chat-bubble bot";
    bolhaBot.textContent = "Chamada de vídeo encerrada. Se precisar, é só iniciar novamente! 👋";
    messages.appendChild(bolhaBot);
    messages.scrollTop = messages.scrollHeight;
  }
}


// === EVENTOS AO CARREGAR A PÁGINA ===
document.addEventListener("DOMContentLoaded", function() {
  
  // Enviar mensagem ao pressionar Enter
  var chatInput = document.getElementById("chatWidgetInput");
  if (chatInput) {
    chatInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Fechar chat ao clicar fora do painel
  document.addEventListener("click", function(e) {
    var panel = document.getElementById("chatWidgetPanel");
    var fab = document.getElementById("chatFabBtn");
    
    if (!panel || !fab) return;
    if (!panel.classList.contains("active")) return;
    
    // Verificar se o clique foi fora do painel e do botão
    if (!panel.contains(e.target) && !fab.contains(e.target)) {
      panel.classList.remove("active");
      fab.style.display = "flex";
    }
  });
});
