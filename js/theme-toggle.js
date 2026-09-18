/* ===================================================
   ALTERNAR TEMA (Dark / Light) - Funcional
   O site usa DOIS sistemas de variáveis sobre a mesma
   página (dashboard.css/style.css e como-funciona.css).
   Para os dois ficarem consistentes ao mesmo tempo, o
   body precisa ter sempre UMA dessas classes, nunca
   nenhuma nem as duas: "dark-mode" ou "light-mode".
   =================================================== */

(function () {

  const STORAGE_KEY = 'inspiraTheme'; // 'dark' | 'light'

  const SUN_ICON = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

  const MOON_ICON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* noop */ }
  }

  function getInitialTheme() {
    const saved = getSavedTheme();
    if (saved === 'light' || saved === 'dark') return saved;
    // Sem preferência salva: o site já nasce no tema escuro (identidade visual padrão)
    return 'dark';
  }

  function updateIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    // Sol = tema atual é escuro (clique para clarear)
    // Lua = tema atual é claro (clique para escurecer)
    icon.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
  }

  function applyTheme(theme) {
    const body = document.body;
    if (!body) return;

    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');

    updateIcon(theme);
  }

  function currentTheme() {
    return document.body && document.body.classList.contains('light-mode') ? 'light' : 'dark';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  }

  function init() {
    applyTheme(getInitialTheme());

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();