// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Глобальные переменные
let gameState = {
    balance: 0,
    level: 1,
    clickPower: 1,
    experience: 0,
    experienceToNextLevel: 100,
    totalClicks: 0,
    autoClicks: 0,
    cooldownReduction: 0,
    expBonus: 0,
    currentSkin: 'default',
    unlockedSkins: ['default', 'gold', 'amber'],
    upgrades: {
        autoclicker: 0,
        clickpower: 0,
        cooldown: 0,
        expbonus: 0
    },
    loggedIn: false,
    username: null,
    isAdmin: false
};

// Стоимость улучшений
const UPGRADES_COST = {
    autoclicker: 50,
    clickpower: 100,
    cooldown: 200,
    expbonus: 300
};

// Стоимость скинов
const SKINS_COST = {
    default: 0,
    gold: 0,
    amber: 0,
    neon: 500,
    rainbow: 1000,
    ice: 750,
    fire: 750,
    galaxy: 1500
};

// Список администраторов
const ADMIN_USERS = ['admin', 'testadmin', 'root', 'moderator'];

// Инициализация приложения
function initApp() {
    loadGameState();
    initIntroScreen();
    initMainScreen();
    initClickerScreen();
    initShopScreen();
    initSkinsScreen();
    initProfileScreen();
    initAdminScreen();
    initModMenu();
    updateUI();
    
    // Автоматическое сохранение каждые 30 секунд
    setInterval(saveGameState, 30000);
    
    // Автоклики
    setInterval(function() {
        if (gameState.autoClicks > 0) {
            addPoints(gameState.autoClicks);
            updateUI();
        }
    }, 1000);
}

// Инициализация экрана загрузки
function initIntroScreen() {
    console.log("Инициализация экрана загрузки...");
    
    // Обработчик для кнопки старта
    document.getElementById('start-button').addEventListener('click', function() {
        console.log("Нажата кнопка старта");
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        // Активируем кликер как начальный экран
        document.getElementById('clicker-screen').classList.add('active');
    });
    
    // Обработчик для иконки замка
    const loginIcon = document.querySelector('.login-icon');
    const loginContainer = document.querySelector('.login-prompt');
    
    // Делаем область для клика больше, включая и сам замок и контейнер вокруг него
    [loginIcon, loginContainer].forEach(element => {
        element.addEventListener('click', function() {
            console.log("Нажата область иконки замка");
            document.getElementById('intro-screen').classList.remove('active');
            document.getElementById('main-screen').classList.add('active');
            
            // Активируем кликер как начальный экран
            document.getElementById('clicker-screen').classList.add('active');
        });
    });
}

// Инициализация основного экрана
function initMainScreen() {
    // Обработчики для карточек сервисов
    document.querySelectorAll('.service-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-target');
            
            // Скрываем все экраны контента
            document.querySelectorAll('.content-screen').forEach(function(screen) {
                screen.classList.remove('active');
            });
            
            // Показываем выбранный экран
            document.getElementById(targetScreen).classList.add('active');
        });
    });
    
    // Обработчик для кнопки оплаты штрафа
    document.querySelector('.pay-button').addEventListener('click', function() {
        if (gameState.balance >= 1000) {
            gameState.balance -= 1000;
            showNotification('Штраф успешно оплачен!');
            updateUI();
        } else {
            showNotification('Недостаточно средств для оплаты штрафа!');
        }
    });
}

// Инициализация экрана кликера
function initClickerScreen() {
    const clickButton = document.getElementById('click-button');
    
    // Изменяем класс кнопки на более современный вид
    clickButton.classList.remove('click-button');
    clickButton.classList.add('classic-button');
    
    clickButton.addEventListener('click', function() {
        const clickValue = gameState.clickPower + Math.floor(gameState.clickPower * (gameState.expBonus / 100));
        
        // Визуальный эффект нажатия
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 100);
        
        // Добавляем вибрацию на мобильных устройствах, если поддерживается
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
        
        // Начисление очков
        addPoints(clickValue);
        
        // Обновление счётчика кликов
        gameState.totalClicks++;
        
        // Обновление интерфейса
        updateUI();
    });
}

// Функция добавления очков
function addPoints(points) {
    gameState.balance += points;
    gameState.experience += points;
    
    // Проверка на повышение уровня
    checkLevelUp();
}

// Проверка на повышение уровня
function checkLevelUp() {
    if (gameState.experience >= gameState.experienceToNextLevel) {
        gameState.experience -= gameState.experienceToNextLevel;
        gameState.level++;
        gameState.experienceToNextLevel = Math.floor(gameState.experienceToNextLevel * 1.2);
        
        showNotification(`Уровень повышен! Текущий уровень: ${gameState.level}`);
    }
}

// Инициализация экрана магазина
function initShopScreen() {
    document.querySelectorAll('.buy-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const itemType = this.getAttribute('data-item');
            const cost = UPGRADES_COST[itemType];
            
            if (gameState.balance >= cost) {
                gameState.balance -= cost;
                
                // Применяем эффект улучшения
                switch(itemType) {
                    case 'autoclicker':
                        gameState.autoClicks++;
                        gameState.upgrades.autoclicker++;
                        break;
                    case 'clickpower':
                        gameState.clickPower++;
                        gameState.upgrades.clickpower++;
                        break;
                    case 'cooldown':
                        gameState.cooldownReduction += 10;
                        gameState.upgrades.cooldown++;
                        break;
                    case 'expbonus':
                        gameState.expBonus += 10;
                        gameState.upgrades.expbonus++;
                        break;
                }
                
                showNotification(`Улучшение "${itemType}" успешно приобретено!`);
                updateUI();
                saveGameState();
            } else {
                showNotification('Недостаточно средств для покупки!');
            }
        });
    });
}

// Инициализация экрана скинов
function initSkinsScreen() {
    // Обновление отображения разблокированных скинов
    updateSkins();
    
    // Обработчики для кнопок выбора скина
    document.querySelectorAll('.select-skin-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const skinType = this.getAttribute('data-skin');
            
            // Если кнопка задизейблена, то это значит что скин не куплен
            if (this.disabled) {
                console.log(`Пытаемся купить скин ${skinType} за ${SKINS_COST[skinType]} очков`);
                if (gameState.balance >= SKINS_COST[skinType]) {
                    gameState.balance -= SKINS_COST[skinType];
                    
                    // Проверяем, есть ли уже этот скин в списке разблокированных
                    if (!gameState.unlockedSkins.includes(skinType)) {
                        gameState.unlockedSkins.push(skinType);
                    }
                    
                    this.disabled = false;
                    this.textContent = 'Выбрать';
                    showNotification(`Скин "${skinType}" успешно приобретен!`);
                    updateUI();
                    saveGameState();
                } else {
                    showNotification('Недостаточно средств для покупки скина!');
                }
                return;
            }
            
            // Если скин уже выбран
            if (gameState.currentSkin === skinType) {
                return;
            }
            
            // Снимаем выделение со всех кнопок
            document.querySelectorAll('.select-skin-button').forEach(function(btn) {
                btn.classList.remove('selected');
                btn.textContent = 'Выбрать';
            });
            
            // Выделяем выбранный скин
            this.classList.add('selected');
            this.textContent = 'Выбрано';
            
            // Устанавливаем выбранный скин
            gameState.currentSkin = skinType;
            
            // Применяем скин к кнопке клика
            applySkinToButton();
            
            showNotification(`Скин "${skinType}" успешно применен!`);
            saveGameState();
        });
    });
}

// Обновление отображения разблокированных скинов
function updateSkins() {
    document.querySelectorAll('.select-skin-button').forEach(function(button) {
        const skinType = button.getAttribute('data-skin');
        
        // Сбрасываем все кнопки
        button.classList.remove('selected');
        
        // Проверяем, разблокирован ли скин
        if (gameState.unlockedSkins.includes(skinType)) {
            button.disabled = false;
            button.textContent = 'Выбрать';
        } else {
            button.disabled = true;
            button.textContent = `Купить ${SKINS_COST[skinType]}`;
        }
        
        // Если это текущий скин, выделяем его
        if (gameState.currentSkin === skinType) {
            button.classList.add('selected');
            button.textContent = 'Выбрано';
        }
    });
    
    // Применяем скин к кнопке клика
    applySkinToButton();
}

// Применяем выбранный скин к кнопке клика
function applySkinToButton() {
    const clickButton = document.getElementById('click-button');
    
    // Удаляем все классы скинов
    clickButton.className = 'classic-button';
    
    // Добавляем класс текущего скина
    clickButton.classList.add(`${gameState.currentSkin}-skin`);
}

// Инициализация экрана профиля
function initProfileScreen() {
    // Обработчик для кнопки входа
    document.getElementById('login-button').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'flex';
    });
    
    // Обработчик для кнопки регистрации
    document.getElementById('register-button').addEventListener('click', function() {
        showNotification('Регистрация временно недоступна');
    });
    
    // Обработчик для кнопки выхода
    document.getElementById('logout-button').addEventListener('click', function() {
        gameState.loggedIn = false;
        gameState.username = null;
        gameState.isAdmin = false;
        
        document.querySelector('.profile-logged').classList.remove('active');
        document.querySelector('.profile-not-logged').classList.add('active');
        
        showNotification('Вы успешно вышли из системы');
        saveGameState();
    });
    
    // Обработчик для закрытия модального окна
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'none';
    });
    
    // Обработчик для отправки формы входа
    document.getElementById('submit-login').addEventListener('click', function() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (username && password) {
            // В реальном приложении здесь была бы аутентификация
            gameState.loggedIn = true;
            gameState.username = username;
            
            // Проверка на администратора (для демо)
            gameState.isAdmin = ADMIN_USERS.includes(username.toLowerCase());
            
            document.querySelector('.profile-not-logged').classList.remove('active');
            document.querySelector('.profile-logged').classList.add('active');
            
            document.getElementById('login-modal').style.display = 'none';
            
            showNotification(`Добро пожаловать, ${username}!`);
            updateUI();
            saveGameState();
            
            // Если пользователь администратор, показываем админ-панель
            if (gameState.isAdmin) {
                document.getElementById('admin-screen').style.display = 'block';
            }
        } else {
            showNotification('Пожалуйста, заполните все поля');
        }
    });
    
    // При клике вне модального окна, закрываем его
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('login-modal')) {
            document.getElementById('login-modal').style.display = 'none';
        }
    });
}

// Инициализация админ-панели
function initAdminScreen() {
    // Установка баланса
    document.getElementById('set-balance-btn').addEventListener('click', function() {
        const balance = parseInt(document.getElementById('admin-balance').value);
        if (!isNaN(balance) && balance >= 0) {
            gameState.balance = balance;
            showNotification(`Баланс установлен: ${balance}`);
            updateUI();
            saveGameState();
        }
    });
    
    // Установка уровня
    document.getElementById('set-level-btn').addEventListener('click', function() {
        const level = parseInt(document.getElementById('admin-level').value);
        if (!isNaN(level) && level >= 1) {
            gameState.level = level;
            showNotification(`Уровень установлен: ${level}`);
            updateUI();
            saveGameState();
        }
    });
    
    // Разблокировка всех предметов
    document.getElementById('unlock-all-items').addEventListener('click', function() {
        // Разблокируем все скины
        gameState.unlockedSkins = Object.keys(SKINS_COST);
        
        // Устанавливаем максимальные улучшения
        gameState.upgrades = {
            autoclicker: 10,
            clickpower: 10,
            cooldown: 10,
            expbonus: 10
        };
        
        gameState.autoClicks = 10;
        gameState.clickPower = 10;
        gameState.cooldownReduction = 100;
        gameState.expBonus = 100;
        
        showNotification('Все предметы разблокированы!');
        updateUI();
        updateSkins();
        saveGameState();
    });
    
    // Сброс предметов
    document.getElementById('reset-items').addEventListener('click', function() {
        // Оставляем только базовые скины
        gameState.unlockedSkins = ['default'];
        gameState.currentSkin = 'default';
        
        // Сбрасываем улучшения
        gameState.upgrades = {
            autoclicker: 0,
            clickpower: 0,
            cooldown: 0,
            expbonus: 0
        };
        
        gameState.autoClicks = 0;
        gameState.clickPower = 1;
        gameState.cooldownReduction = 0;
        gameState.expBonus = 0;
        
        showNotification('Все предметы сброшены!');
        updateUI();
        updateSkins();
        saveGameState();
    });
    
    // Сброс прогресса
    document.getElementById('reset-progress').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить!')) {
            resetGameState();
            showNotification('Весь прогресс сброшен!');
        }
    });
}

// Инициализация мод-меню
function initModMenu() {
    // Открытие/закрытие мод-меню по нажатию Tab
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            toggleModMenu();
        }
    });
    
    // Открытие мод-меню через мобильную кнопку
    document.getElementById('mobile-mod-button').addEventListener('click', function() {
        toggleModMenu();
    });
    
    // Закрытие мод-меню по нажатию на крестик
    document.querySelector('.close-mod-menu').addEventListener('click', function() {
        document.getElementById('mod-menu').style.display = 'none';
    });
    
    // Обновление текущей информации при открытии мод-меню
    document.getElementById('mod-balance').value = gameState.balance;
    document.getElementById('mod-level').value = gameState.level;
    
    // Установка баланса
    document.getElementById('set-mod-balance').addEventListener('click', function() {
        const balance = parseInt(document.getElementById('mod-balance').value);
        if (!isNaN(balance) && balance >= 0) {
            gameState.balance = balance;
            showNotification(`Баланс установлен: ${balance}`);
            updateUI();
            saveGameState();
        }
    });
    
    // Установка уровня
    document.getElementById('set-mod-level').addEventListener('click', function() {
        const level = parseInt(document.getElementById('mod-level').value);
        if (!isNaN(level) && level >= 1) {
            gameState.level = level;
            showNotification(`Уровень установлен: ${level}`);
            updateUI();
        }
    });
    
    // Разблокировка всех скинов
    document.getElementById('unlock-all-skins').addEventListener('click', function() {
        gameState.unlockedSkins = Object.keys(SKINS_COST);
        showNotification('Все скины разблокированы!');
        updateSkins();
    });
    
    // Разблокировка всех улучшений
    document.getElementById('unlock-all-upgrades').addEventListener('click', function() {
        gameState.upgrades = {
            autoclicker: 10,
            clickpower: 10,
            cooldown: 10,
            expbonus: 10
        };
        
        gameState.autoClicks = 10;
        gameState.clickPower = 10;
        gameState.cooldownReduction = 100;
        gameState.expBonus = 100;
        
        showNotification('Все улучшения разблокированы!');
        updateUI();
    });
    
    // Сохранение игры
    document.getElementById('save-game').addEventListener('click', function() {
        saveGameState();
        showNotification('Игра сохранена!');
    });
    
    // Сброс прогресса
    document.getElementById('reset-all').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить!')) {
            resetGameState();
            showNotification('Весь прогресс сброшен!');
        }
    });
}

// Переключение мод-меню
function toggleModMenu() {
    const modMenu = document.getElementById('mod-menu');
    if (modMenu.style.display === 'block') {
        modMenu.style.display = 'none';
    } else {
        // Обновляем информацию в полях перед открытием
        document.getElementById('mod-balance').value = gameState.balance;
        document.getElementById('mod-level').value = gameState.level;
        
        // Отображаем текущий баланс для наглядности
        document.getElementById('current-balance').textContent = gameState.balance;
        
        modMenu.style.display = 'block';
    }
}

// Обновление интерфейса
function updateUI() {
    // Обновление счётчиков
    document.getElementById('balance').textContent = formatNumber(gameState.balance);
    document.getElementById('level').textContent = gameState.level;
    
    // Обновление прогресса
    document.getElementById('progress-text').textContent = `${formatNumber(gameState.experience)}/${formatNumber(gameState.experienceToNextLevel)}`;
    document.getElementById('progress-fill').style.width = `${(gameState.experience / gameState.experienceToNextLevel) * 100}%`;
    
    // Обновление информации о кулдауне
    document.getElementById('cooldown-text').textContent = `Сила клика: ${gameState.clickPower} | Автокликов в сек: ${gameState.autoClicks}`;
    
    // Обновление профиля, если пользователь авторизован
    if (gameState.loggedIn) {
        document.getElementById('username').textContent = gameState.username;
        document.getElementById('total-clicks').textContent = formatNumber(gameState.totalClicks);
        document.getElementById('max-level').textContent = gameState.level;
        document.getElementById('skins-owned').textContent = `${gameState.unlockedSkins.length}/${Object.keys(SKINS_COST).length}`;
        
        const totalUpgrades = Object.values(gameState.upgrades).reduce((a, b) => a + b, 0);
        const maxUpgrades = Object.keys(gameState.upgrades).length * 10;
        document.getElementById('upgrades-owned').textContent = `${totalUpgrades}/${maxUpgrades}`;
    }
}

// Форматирование чисел (для больших значений)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

// Показ уведомления
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}

// Сохранение состояния игры
function saveGameState() {
    localStorage.setItem('russianKombatGameState', JSON.stringify(gameState));
    console.log('Игра сохранена');
}

// Загрузка состояния игры
function loadGameState() {
    const savedState = localStorage.getItem('russianKombatGameState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            
            // Обновляем gameState, сохраняя структуру объекта
            for (const key in parsedState) {
                if (key in gameState) {
                    gameState[key] = parsedState[key];
                }
            }
            
            console.log('Игра загружена');
        } catch (e) {
            console.error('Ошибка при загрузке игры:', e);
            resetGameState();
        }
    } else {
        // Если игра запускается впервые, добавляем начальные скины
        gameState.unlockedSkins = ['default', 'gold', 'amber'];
        saveGameState();
    }
    
    // Проверяем, что бесплатные скины всегда разблокированы
    const freeSkinsCheck = ['default', 'gold', 'amber'];
    freeSkinsCheck.forEach(skin => {
        if (!gameState.unlockedSkins.includes(skin)) {
            gameState.unlockedSkins.push(skin);
        }
    });
}

// Сброс состояния игры
function resetGameState() {
    gameState = {
        balance: 0,
        level: 1,
        clickPower: 1,
        experience: 0,
        experienceToNextLevel: 100,
        totalClicks: 0,
        autoClicks: 0,
        cooldownReduction: 0,
        expBonus: 0,
        currentSkin: 'default',
        unlockedSkins: ['default', 'gold', 'amber'],
        upgrades: {
            autoclicker: 0,
            clickpower: 0,
            cooldown: 0,
            expbonus: 0
        },
        loggedIn: false,
        username: null,
        isAdmin: false
    };
    
    saveGameState();
    updateUI();
    updateSkins();
    
    // Сбрасываем экраны
    document.querySelector('.profile-logged').classList.remove('active');
    document.querySelector('.profile-not-logged').classList.add('active');
    
    document.getElementById('admin-screen').style.display = 'none';
    
    console.log('Игра сброшена');
} 