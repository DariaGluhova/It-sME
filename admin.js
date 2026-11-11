// ==========================================================================
// IT'S ME WIKI // INDEPENDENT ADMIN PANEL & CONTENT MANAGEMENT SYSTEM
// ==========================================================================
(function() {
  console.log("[SYS_ADMIN]: Запуск автономного модуля администрирования...");

  function initAdminSystem() {
    const currentUser = (localStorage.getItem('it_me_current_user') || '').toLowerCase().trim();
    
    // ПРОВЕРКА: Если вошел админ — включаем панель управления
    if (currentUser === 'admin') {
      console.log("[SYS_ADMIN]: Права администратора подтверждены.");
      
      // 1. Применяем ранее сохраненную структуру HTML для текущей страницы
      const storageKeyHTML = `wiki_full_html_${window.location.pathname}`;
      const savedHTML = localStorage.getItem(storageKeyHTML);
      const mainContainer = document.querySelector('.main-terminal') || document.querySelector('.terminal-layout');

      if (savedHTML && mainContainer) {
        mainContainer.innerHTML = savedHTML;
      }

      // 2. Отрисовываем админ-панель
      renderAdminPanel(mainContainer);
    } else {
      console.log("[SYS_ADMIN]: Обычный режим (Админ-панель скрыта).");
      const existingPanel = document.getElementById('adminControlPanel');
      if (existingPanel) existingPanel.remove();
    }
  }

  function renderAdminPanel(container) {
    let existingPanel = document.getElementById('adminControlPanel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'adminControlPanel';
    panel.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      background: #080202 !important;
      border: 2px solid #FF1A1A !important;
      padding: 12px 18px !important;
      z-index: 9999999 !important;
      box-shadow: 0 0 35px rgba(255, 26, 26, 0.9) !important;
      font-family: 'Fira Code', monospace !important;
      display: flex !important;
      gap: 10px !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      max-width: 95vw !important;
    `;

    panel.innerHTML = `
      <span style="color: #FF1A1A; font-size: 0.85rem; font-weight: bold;">[ ADMIN_PANEL ]</span>
      <button id="toggleEditBtn" style="background: #1A0505; color: #FF1A1A; border: 1px solid #FF1A1A; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem; font-weight: bold;">[ EDIT: ON ]</button>
      <button id="addBlockBtn" style="background: #020000; color: #E0D5D5; border: 1px solid #4A1515; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem;">[ + BLOCK ]</button>
      <button id="addImageBtn" style="background: #020000; color: #E0D5D5; border: 1px solid #4A1515; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem;">[ + IMAGE ]</button>
      <button id="saveWikiBtn" style="background: #020000; color: #00FF66; border: 1px solid #00FF66; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem; font-weight: bold;">[ SAVE ]</button>
      <button id="resetWikiBtn" style="background: #020000; color: #FF7700; border: 1px solid #FF7700; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem;">[ RESET ]</button>
      <button id="viewUsersBtn" style="background: #020000; color: #FF1A1A; border: 1px solid #8B0000; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem;">[ USERS ]</button>
      <button id="logoutAdminBtn" style="background: #020000; color: #7E6A6A; border: 1px solid #7E6A6A; padding: 6px 10px; cursor: pointer; font-family: monospace; font-size: 0.78rem;">[ EXIT ]</button>
    `;

    document.body.appendChild(panel);

    let isEditing = true;

    function applyEditState(state) {
      isEditing = state;
      const toggleBtn = document.getElementById('toggleEditBtn');

      const textEls = container ? container.querySelectorAll('h1, h2, h3, h4, p, .block-title, .welcome-title, .mono-sub, .box-desc, .lore-text-content, .subject-name, .subject-spec, .char-name, .char-desc') : [];

      textEls.forEach(el => {
        if (isEditing) {
          el.contentEditable = "true";
          el.style.outline = "1px dashed rgba(255, 26, 26, 0.5)";
          el.style.cursor = "text";
        } else {
          el.contentEditable = "false";
          el.style.outline = "none";
          el.style.cursor = "default";
        }
      });

      // Кнопки удаления блоков [X]
      const blocks = container ? container.querySelectorAll('.sys-block') : [];
      blocks.forEach(block => {
        let header = block.querySelector('.block-header');
        let deleteBtn = block.querySelector('.admin-delete-block-btn');

        if (isEditing) {
          if (!deleteBtn && header) {
            deleteBtn = document.createElement('button');
            deleteBtn.className = 'admin-delete-block-btn';
            deleteBtn.textContent = '[ X УДАЛИТЬ БЛОК ]';
            deleteBtn.style.cssText = 'background: #200000; color: #FF1A1A; border: 1px solid #FF1A1A; padding: 2px 6px; font-size: 0.65rem; cursor: pointer; font-family: monospace; margin-left: 10px;';
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (confirm('ВНИМАНИЕ: Удалить этот блок со страницы?')) {
                block.remove();
              }
            });
            header.appendChild(deleteBtn);
          }
        } else {
          if (deleteBtn) deleteBtn.remove();
        }
      });

      if (toggleBtn) {
        toggleBtn.textContent = isEditing ? '[ EDIT: ON ]' : '[ EDIT: OFF ]';
        toggleBtn.style.color = isEditing ? '#FF1A1A' : '#7E6A6A';
        toggleBtn.style.borderColor = isEditing ? '#FF1A1A' : '#7E6A6A';
      }
    }

    applyEditState(true);

    // ПЕРЕКЛЮЧЕНИЕ РЕДАКТИРОВАНИЯ
    document.getElementById('toggleEditBtn').addEventListener('click', () => {
      applyEditState(!isEditing);
    });

    // ДОБАВИТЬ БЛОК
    document.getElementById('addBlockBtn').addEventListener('click', () => {
      if (!container) return;
      const newBlock = document.createElement('div');
      newBlock.className = 'sys-block border-single';
      newBlock.style.marginTop = '20px';
      newBlock.innerHTML = `
        <div class="block-header">
          <span class="block-id">[ SYS_CUSTOM_NODE ]</span>
          <span class="block-tag">USER_BLOCK</span>
        </div>
        <h3 class="block-title" contenteditable="true">НОВЫЙ ЗАГОЛОВОК</h3>
        <p contenteditable="true" style="color: #D5CCCC; font-size: 0.92rem; margin-top: 8px;">Введите текст нового блока здесь...</p>
      `;
      container.appendChild(newBlock);
      applyEditState(true);
      alert('Новый блок успешно добавлен!');
    });

    // ДОБАВИТЬ КАРТИНКУ
    document.getElementById('addImageBtn').addEventListener('click', () => {
      if (!container) return;
      const imgUrl = prompt('Введите URL или путь к картинке (например: avatar.jpg или https://site.com/image.png):');
      if (!imgUrl) return;
      const imgCaption = prompt('Введите описание картинки:', 'Изображение терминала');

      const imgBlock = document.createElement('div');
      imgBlock.className = 'sys-block border-single';
      imgBlock.style.marginTop = '20px';
      imgBlock.innerHTML = `
        <div class="block-header">
          <span class="block-id">[ SYS_IMAGE_NODE ]</span>
          <span class="block-tag">VISUAL</span>
        </div>
        <div style="margin: 12px 0; text-align: center;">
          <img src="${imgUrl}" alt="Visual Data" style="max-width: 100%; height: auto; border: 1px solid #8B0000; display: inline-block; max-height: 400px; object-fit: cover;" />
        </div>
        <p contenteditable="true" class="mono-sub" style="text-align: center; color: #7E6A6A;">${imgCaption || ''}</p>
      `;
      container.appendChild(imgBlock);
      applyEditState(true);
      alert('Картинка успешно вставлена!');
    });

    // СОХРАНЕНИЕ В LOCALSTORAGE
    document.getElementById('saveWikiBtn').addEventListener('click', () => {
      if (container) {
        applyEditState(false);
        localStorage.setItem(`wiki_full_html_${window.location.pathname}`, container.innerHTML);
        applyEditState(true);
      }

      const saveBtn = document.getElementById('saveWikiBtn');
      saveBtn.textContent = '[ SAVED! ]';
      saveBtn.style.color = '#FFFFFF';
      saveBtn.style.borderColor = '#FFFFFF';
      
      setTimeout(() => {
        saveBtn.textContent = '[ SAVE ]';
        saveBtn.style.color = '#00FF66';
        saveBtn.style.borderColor = '#00FF66';
      }, 1200);
    });

    // СБРОС ИСХОДНОГО ВИДА СТРАНИЦЫ
    document.getElementById('resetWikiBtn').addEventListener('click', () => {
      if (confirm('Сбросить все изменения на этой странице к исходному коду?')) {
        localStorage.removeItem(`wiki_full_html_${window.location.pathname}`);
        location.reload();
      }
    });

    // СМОТРЕТЬ БАЗУ ПОЛЬЗОВАТЕЛЕЙ
    document.getElementById('viewUsersBtn').addEventListener('click', () => {
      const data = localStorage.getItem('it_me_users');
      const usersObj = data ? JSON.parse(data) : {};
      const userNames = Object.keys(usersObj);
      const activeUser = (localStorage.getItem('it_me_current_user') || '').toUpperCase();
      
      let userListFormatted = userNames.map((name, i) => {
        const isCurrent = name.toUpperCase() === activeUser ? ' <ACTIVE>' : '';
        return `${i + 1}. [ ${name.toUpperCase()} ]${isCurrent}`;
      }).join('\n');

      alert(`========================================\n[ SYS_USER_REGISTRY // БАЗА СУБЪЕКТОВ ]\n========================================\nТЕКУЩИЙ СЕАНС: [ ${activeUser} ]\nВСЕГО ЗАРЕГИСТРИРОВАНО: ${userNames.length}\n----------------------------------------\n${userListFormatted}\n========================================`);
    });

    // ВЫХОД
    document.getElementById('logoutAdminBtn').addEventListener('click', () => {
      if (confirm('Завершить сеанс администратора?')) {
        localStorage.removeItem('it_me_current_user');
        location.reload();
      }
    });
  }

  // Запуск при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminSystem);
  } else {
    initAdminSystem();
  }
})();