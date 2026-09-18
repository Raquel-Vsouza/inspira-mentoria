/**
 * como-funciona.js
 * Algoritmo de Match Dinâmico por IA & Interatividade da Página
 */

// Base de dados simulada de mentores cadastrados
const mentoresCadastrados = [
  {
    palavrasChave: ["aws", "cloud", "nuvem", "devops", "docker", "kubernetes", "infraestrutura"],
    nome: "Carlos Eduardo",
    cargo: "Senior Cloud Architect @ AWS",
    biografia: "Especialista em migração para nuvem AWS e arquiteturas distribuídas."
  },
  {
    palavrasChave: ["react", "frontend", "front-end", "javascript", "js", "html", "css", "web", "typescript"],
    nome: "Mariana Silva",
    cargo: "Staff Frontend Engineer",
    biografia: "Desenvolvedora especialista em React, UI/UX e aplicações web de alta performance."
  },
  {
    palavrasChave: ["python", "dados", "data science", "ia", "inteligencia artificial", "machine learning"],
    nome: "Lucas Prado",
    cargo: "Lead Data Scientist",
    biografia: "Cientista de dados com foco em IA generativa e modelos preditivos."
  },
  {
    palavrasChave: ["java", "spring", "backend", "back-end", "microservicos"],
    nome: "Fernanda Lima",
    cargo: "Senior Backend Developer",
    biografia: "Engenheira Backend focada em sistemas distribuídos e Spring Boot."
  },
  {
    palavrasChave: ["carreira", "entrevista", "curriculo", "linkedin", "transicao", "estagio"],
    nome: "Roberto Alves",
    cargo: "Tech Recruiter & Coach de Carreira",
    biografia: "Mentoria de carreira, preparação para entrevistas e posicionamento no mercado."
  }
];

/**
 * Função global para acionar o Match Dinâmico por IA
 */
window.runDemoMatch = function () {
  const input = document.getElementById("demoInput");
  const outputBox = document.getElementById("demoOutputBox");

  if (!input || !outputBox) return;

  const desafio = input.value.trim().toLowerCase();

  // 1. Validação de campo vazio
  if (!desafio) {
    outputBox.innerHTML = `
      <div style="color: #f59e0b; font-family: monospace;">
        [Aviso do Sistema] Por favor, digite seu desafio no campo ao lado para que a IA possa analisar.
      </div>
    `;
    return;
  }

  // 2. Estado de Carregamento da IA
  outputBox.innerHTML = `
    <div style="color: #DDAA55; font-family: monospace;">
      [IA Processando] Analisando desafio: <em>"${input.value}"</em>...<br>
      Buscando especialistas compatíveis na rede Inspira...
    </div>
  `;

  // 3. Processamento simulado do algoritmo de busca (1 segundo)
  setTimeout(() => {
    const mentorMatch = mentoresCadastrados.find(mentor =>
      mentor.palavrasChave.some(kw => desafio.includes(kw))
    );

    if (mentorMatch) {
      // CASO 1: ENCONTROU MENTOR
      outputBox.innerHTML = `
        <div style="font-family: system-ui, sans-serif;">
          <div style="color: #10b981; font-weight: 700; font-size: 14px; margin-bottom: 6px;">
            Match Realizado com Sucesso! (Compatibilidade: 98%)
          </div>
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(221, 170, 85, 0.3); border-radius: 8px; padding: 12px; margin-top: 6px;">
            <strong style="color: #DDAA55; font-size: 15px;">${mentorMatch.nome}</strong><br>
            <span style="font-size: 13px; opacity: 0.9;">${mentorMatch.cargo}</span>
            <p style="font-size: 12px; opacity: 0.75; margin-top: 6px; line-height: 1.4;">"${mentorMatch.biografia}"</p>
          </div>
        </div>
      `;
    } else {
      // CASO 2: NÃO ENCONTROU MENTOR ESPECIALIZADO
      outputBox.innerHTML = `
        <div style="font-family: system-ui, sans-serif;">
          <div style="color: #ef4444; font-weight: 700; font-size: 14px; margin-bottom: 6px;">
            Não encontrei um mentor especializado nisso.
          </div>
          <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.5; color: #d1d5db;">
            No momento não temos um mentor cadastrado especificamente para esse desafio.<br><br>
            <strong>Dica:</strong> Tente utilizar termos como <em>Cloud AWS, React Frontend, Python, Java Spring</em> ou <em>Dicas de Carreira</em>.
          </div>
        </div>
      `;
    }
  }, 1000);
};

/**
 * Função global para alternar o Accordion de Perguntas Frequentes (FAQ)
 */
window.toggleFaq = function (element) {
  element.classList.toggle('active');
};

/**
 * Event Listener para acionar o Match ao pressionar a tecla ENTER no input
 */
document.addEventListener("DOMContentLoaded", () => {
  const demoInput = document.getElementById("demoInput");
  if (demoInput) {
    demoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.runDemoMatch();
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens abertos (opcional - mantenha se quiser um por vez)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Abre o clicado se não estava ativo
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});