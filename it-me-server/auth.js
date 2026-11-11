document.addEventListener('DOMContentLoaded', () => {
  // Инициализация базы пользователей
  function getDatabaseUsers() {
    let users = {};
    try {
      const data = localStorage.getItem('it_me_users');
      users = data ? JSON.parse(data) : {};
    } catch (e) {
      users = {};
    }
    users['admin'] = 'admin123';
    localStorage.setItem('it_me_users', JSON.stringify(users));
    return users;
  }

  getDatabaseUsers();

  const authBtn = document.getElementById('authBtn');
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const usernameInput = document.getElementById('authUsername');
  const passwordInput = document.getElementById('authPassword');
  const statusMsg = document.getElementById('authStatusMessage');

  const currentUser = (localStorage.getItem('it_me_current_user') || '').toLowerCase().trim();

  if (authBtn && currentUser) {
    authBtn.textContent = `[ USER: ${currentUser.toUpperCase()} ]`;
  }

  // Открытие/закрытие модального окна
  if (authBtn && modal) {
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (statusMsg) statusMsg.textContent = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        if (statusMsg) statusMsg.textContent = '';
      }
    });
  }

  // РЕГИСТРАЦИЯ
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const username = (usernameInput ? usernameInput.value : '').trim().toLowerCase();
      const password = (passwordInput ? passwordInput.value : '').trim();

      if (!username || !password) {
        if (statusMsg) {
          statusMsg.style.color = '#FF1A1A';
          statusMsg.textContent = 'ОШИБКА: Заполните все поля!';
        }
        return;
      }

      const users = getDatabaseUsers();

      if (users[username]) {
        if (statusMsg) {
          statusMsg.style.color = '#FF1A1A';
          statusMsg.textContent = 'ОШИБКА: Субъект уже зарегистрирован!';
        }
        return;
      }

      users[username] = password;
      localStorage.setItem('it_me_users', JSON.stringify(users));

      if (statusMsg) {
        statusMsg.style.color = '#00FF66';
        statusMsg.textContent = `СУБЪЕКТ [${username.toUpperCase()}] УСПЕШНО ЗАРЕГИСТРИРОВАН.`;
      }
    });
  }

  // ВХОД С МГНОВЕННОЙ ПЕРЕЗАГРУЗКОЙ ДЛЯ АДМИНА
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = (usernameInput ? usernameInput.value : '').trim().toLowerCase();
      const password = (passwordInput ? passwordInput.value : '').trim();

      if (!username || !password) {
        if (statusMsg) {
          statusMsg.style.color = '#FF1A1A';
          statusMsg.textContent = 'ОШИБКА: Заполните все поля!';
        }
        return;
      }

      const users = getDatabaseUsers();

      if (!users[username]) {
        if (statusMsg) {
          statusMsg.style.color = '#FF1A1A';
          statusMsg.textContent = 'ОШИБКА: Субъект не найден в реестре!';
        }
        return;
      }

      if (users[username] !== password) {
        if (statusMsg) {
          statusMsg.style.color = '#FF1A1A';
          statusMsg.textContent = 'ОШИБКА: Неверный код доступа!';
        }
        return;
      }

      localStorage.setItem('it_me_current_user', username);

      if (statusMsg) {
        statusMsg.style.color = '#00FF66';
        statusMsg.textContent = `ДОСТУП РАЗРЕШЕН. Перезагрузка системы...`;
      }

      // Перезагрузка страницы для передачи управления в admin.js
      setTimeout(() => {
        location.reload();
      }, 300);
    });
  }
});