document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-wrapper .sys-input');
  const searchBtn = document.querySelector('.search-wrapper .search-btn');

  if (!searchInput) return;

  const wikiDatabase = [
    { title: "HOME // OVERVIEW & NEWS", page: "index.html", keywords: ["home", "главная", "about", "игра", "it's me", "overview", "news", "патчи", "разработчики", "андрей", "самса"] },
    { title: "CHARACTERS // OMBRA", page: "characters.html", keywords: ["ombra", "омбра", "killer", "убийца", "characters", "персонажи", "программист"] },
    { title: "CHARACTERS // REAPER", page: "characters.html", keywords: ["reaper", "рипер", "survivor", "выживший", "мафиозо", "characters", "персонажи"] },
    { title: "CHARACTERS // ARDI", page: "characters.html", keywords: ["ardi", "арди", "support", "саппорт", "химик", "characters", "персонажи"] },
    { title: "LORE FILES // ARCHIVES", page: "lore.html", keywords: ["lore", "лор", "архив", "история", "циклы", "файлы"] },
    { title: "MAP SCHEMATICS // SECTORS", page: "maps.html", keywords: ["map", "карты", "crossroads", "glasshouses", "hq", "схемы", "аномалии"] },
    { title: "STRATEGY MATRIX // TACTICS", page: "strategy.html", keywords: ["strategy", "стратегия", "тактика", "уклонение", "матрица"] },
    { title: "GAME MECHANICS // ROUNDS & INTERMISSION", page: "mechanics.html", keywords: ["mechanics", "механика", "антракт", "раунд", "цели", "игра"] }
  ];

  // Создаем автономный выпадающий контейнер прямо в <body>, чтобы верстка шапки не влияла на него
  let suggestBox = document.getElementById('sysSuggestBox');
  if (!suggestBox) {
    suggestBox = document.createElement('div');
    suggestBox.id = 'sysSuggestBox';
    suggestBox.className = 'sys-suggest-box';
    document.body.appendChild(suggestBox);
  }

  // Расчет позиционирования прямо под инпутом
  function updateSuggestPosition() {
    const rect = searchInput.getBoundingClientRect();
    suggestBox.style.top = `${rect.bottom + window.scrollY + 6}px`;
    suggestBox.style.left = `${rect.left + window.scrollX}px`;
    suggestBox.style.width = `${rect.width}px`;
  }

  function findMatches(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return wikiDatabase.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.keywords.some(kw => kw.includes(q))
    );
  }

  function renderSuggest() {
    const query = searchInput.value;
    const matches = findMatches(query);

    if (!query.trim()) {
      suggestBox.style.display = 'none';
      suggestBox.innerHTML = '';
      return;
    }

    updateSuggestPosition();

    if (matches.length === 0) {
      suggestBox.innerHTML = `
        <div class="suggest-empty-item">
          [SYS_ERR]: Совпадений не найдено
        </div>`;
    } else {
      suggestBox.innerHTML = matches.map(item => `
        <div class="suggest-row-item" data-url="${item.page}">
          <span class="suggest-icon">🔍</span>
          <span class="suggest-text-title">${item.title}</span>
        </div>
      `).join('');
    }
    suggestBox.style.display = 'block';
  }

  // Настройка событий
  searchInput.addEventListener('input', renderSuggest);
  
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      renderSuggest();
    }
  });

  // Переход при клике по строке саджеста
  suggestBox.addEventListener('click', (e) => {
    const row = e.target.closest('.suggest-row-item');
    if (row && row.dataset.url) {
      window.location.href = row.dataset.url;
    }
  });

  // Переход по Enter
  function executeSearchJump() {
    const query = searchInput.value;
    const matches = findMatches(query);
    if (matches.length > 0) {
      window.location.href = matches[0].page;
    }
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearchJump();
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      executeSearchJump();
    });
  }

  // Закрытие при клике вне поля и саджеста
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.style.display = 'none';
    }
  });

  // Пересчет позиции при изменении размера окна
  window.addEventListener('resize', () => {
    if (suggestBox.style.display === 'block') {
      updateSuggestPosition();
    }
  });
});