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
    isAdmin: false,
    demonSacrifice: 0,
    goldMultiplier: 1,
    goldClicks: 0,
    iceFrozen: false,
    iceCombo: 0,
    frozenMultiplier: 1,
    matrixCode: '',
    hackProgress: 0,
    plasmaCharge: 0,
    voidEnergy: 0,
    voidPower: 1,
    blessings: 0,
    healingPower: 1,
    toxicStacks: 0,
    mutations: 0,
    shadowPower: 0,
    shadowClones: 0,
    balanceFrozen: false,
    frozenBalance: 0
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
    rainbow: 1000,
    ice: 750,
    fire: 750,
    galaxy: 1500,
    matrix: 2000,
    plasma: 2500,
    void: 3000,
    quantum: 5000,
    cyber: 3500,
    dragon: 4000,
    demon: 4500,
    angel: 4500,
    toxic: 3200,
    shadow: 3800
};

// Список администраторов
const ADMIN_USERS = ['admin', 'testadmin', 'root', 'moderator'];

// Добавляем режимы игры
const GAME_MODES = {
    clicker: 'Кликер',
    runner: 'В разработке',
    puzzle: 'В разработке',
    'space-battle': 'В разработке'
};

// Состояние режимов игры
let gameModesState = {
    currentMode: 'clicker',
    clicker: {
        clickPower: 1,
        experience: 0,
        experienceToNextLevel: 100,
        totalClicks: 0
    },
    runner: {
        score: 0,
        coins: 0,
        distance: 0,
        obstacles: []
    },
    puzzle: {
        level: 1,
        solved: 0,
        currentPuzzle: null
    },
    'space-battle': {
        score: 0,
        level: 1,
        health: 100,
        enemies: []
    }
};

// Инициализация приложения
function initApp() {
    loadGameState();
    initIntroScreen();
    initMainScreen();
    initShopScreen();
    initSkinsScreen();
    initProfileScreen();
    initAdminScreen();
    initModMenu();
    initGameModes(); // Инициализация всех режимов игры
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
    console.log("Инициализация основного экрана...");
    
    // Обработчики для карточек сервисов
    document.querySelectorAll('.service-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-target');
            console.log("Переход на экран:", targetScreen);
            
            // Скрываем все экраны
            document.querySelectorAll('.content-screen, .game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Показываем выбранный экран
            const screenToShow = document.getElementById(targetScreen);
            if (screenToShow) {
                screenToShow.classList.add('active');
                console.log("Активирован экран:", targetScreen);
            }
        });
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
        
        // Специальный эффект для галактического скина
        if (gameState.currentSkin === 'galaxy') {
            this.classList.add('traveling');
            setTimeout(() => this.classList.remove('traveling'), 3000);
            
            // Добавляем бонус за галактическое путешествие
            const galaxyBonus = Math.floor(Math.random() * 10) + 1;
            addPoints(clickValue * galaxyBonus);
            showNotification(`Галактический бонус: x${galaxyBonus}!`);
        } else {
            addPoints(clickValue);
        }
        
        // Добавляем вибрацию на мобильных устройствах
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
        
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
    
    // Обновляем интерфейс
    updateUI();
    
    // Сохраняем состояние игры
    saveGameState();
}

// Проверка на повышение уровня
function checkLevelUp() {
    if (gameState.experience >= gameState.experienceToNextLevel) {
        gameState.experience -= gameState.experienceToNextLevel;
        gameState.level++;
        gameState.experienceToNextLevel = Math.floor(gameState.experienceToNextLevel * 1.2);
        
        showNotification(`Уровень повышен! Текущий уровень: ${gameState.level}`);
        updateUI();
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
    
    // Удаляем все обработчики
    const allHandlers = [
        handleFireSkinClick,
        handleDragonSkinClick,
        handleDemonSkinClick,
        handleGoldSkinClick,
        handleIceSkinClick,
        handleMatrixSkinClick,
        handlePlasmaSkinClick,
        handleVoidSkinClick,
        handleQuantumSkinClick,
        handleCyberSkinClick,
        handleAngelSkinClick,
        handleToxicSkinClick,
        handleShadowSkinClick
    ];
    
    allHandlers.forEach(handler => {
        clickButton.removeEventListener('click', handler);
    });
    
    // Удаляем все классы скинов
    clickButton.className = 'classic-button';
    clickButton.classList.add(`${gameState.currentSkin}-skin`);
    
    // Добавляем обработчик в зависимости от скина
    switch(gameState.currentSkin) {
        case 'fire':
            clickButton.addEventListener('click', handleFireSkinClick);
            break;
        case 'dragon':
            clickButton.addEventListener('click', handleDragonSkinClick);
            break;
        case 'demon':
            clickButton.addEventListener('click', handleDemonSkinClick);
            break;
        case 'gold':
            clickButton.addEventListener('click', handleGoldSkinClick);
            break;
        case 'ice':
            clickButton.addEventListener('click', handleIceSkinClick);
            break;
        case 'matrix':
            clickButton.addEventListener('click', handleMatrixSkinClick);
            break;
        case 'plasma':
            clickButton.addEventListener('click', handlePlasmaSkinClick);
            break;
        case 'void':
            clickButton.addEventListener('click', handleVoidSkinClick);
            break;
        case 'quantum':
            clickButton.addEventListener('click', handleQuantumSkinClick);
            break;
        case 'cyber':
            clickButton.addEventListener('click', handleCyberSkinClick);
            break;
        case 'angel':
            clickButton.addEventListener('click', handleAngelSkinClick);
            break;
        case 'toxic':
            clickButton.addEventListener('click', handleToxicSkinClick);
            break;
        case 'shadow':
            clickButton.addEventListener('click', handleShadowSkinClick);
            break;
    }
}

function handleFireSkinClick() {
    // Шанс удачи/неудачи
    const luck = Math.random();
    
    // Создаем эффект огня
    const fireEffect = document.createElement('div');
    fireEffect.className = 'fire-effect';
    document.body.appendChild(fireEffect);
    
    // Позиционируем эффект около кнопки
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    fireEffect.style.left = rect.left + 'px';
    fireEffect.style.top = rect.top + 'px';
    
    if (luck > 0.7) { // 30% шанс удачи
        // Удача - двойные очки и огненный эффект
        fireEffect.classList.add('lucky-fire');
        const points = gameState.clickPower * 2;
        addPoints(points);
        showNotification('🔥 Огненная удача! x2 очков!');
    } else if (luck < 0.1) { // 10% шанс неудачи
        // Неудача - потеря очков и тёмный огонь
        fireEffect.classList.add('unlucky-fire');
        const lostPoints = Math.floor(gameState.clickPower * 0.5);
        gameState.balance = Math.max(0, gameState.balance - lostPoints);
        showNotification('💀 Огненная неудача! -50% очков!');
    } else {
        // Обычный клик с огненным эффектом
        fireEffect.classList.add('normal-fire');
        addPoints(gameState.clickPower);
    }
    
    // Удаляем эффект через секунду
    setTimeout(() => {
        document.body.removeChild(fireEffect);
    }, 1000);
}

// Обновляем функцию для создания эффектов
function createEffect(className) {
    const effect = document.createElement('div');
    effect.className = className;
    const container = document.getElementById('effects-container');
    container.appendChild(effect);
    
    // Позиционируем эффект около кнопки
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    effect.style.left = rect.left + 'px';
    effect.style.top = rect.top + 'px';
    
    // Удаляем эффект через секунду
    setTimeout(() => {
        container.removeChild(effect);
    }, 1000);
    
    return effect;
}

function handleDemonSkinClick() {
    // Система жертвоприношения
    gameState.demonSacrifice = (gameState.demonSacrifice || 0) + 1;
    
    // Создаем базовый эффект демонической энергии
    const demonEnergy = createEffect('demon-energy');
    
    // Позиционируем все эффекты относительно кнопки
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    demonEnergy.style.left = (centerX - 100) + 'px';
    demonEnergy.style.top = (centerY - 100) + 'px';
    
    // Если накоплено достаточно жертв, активируем ритуал
    if (gameState.demonSacrifice >= 6) {
        // Создаем круг ритуала
        const ritualCircle = createEffect('ritual-circle');
        ritualCircle.style.left = (centerX - 150) + 'px';
        ritualCircle.style.top = (centerY - 150) + 'px';
        
        // Добавляем демонические руны
        const demonRunes = createEffect('demon-runes');
        demonRunes.style.left = (centerX - 200) + 'px';
        demonRunes.style.top = (centerY - 200) + 'px';
        
        // Добавляем эффект пламени
        const demonFlames = createEffect('demon-flames');
        demonFlames.style.left = (centerX - 125) + 'px';
        demonFlames.style.top = (centerY - 125) + 'px';
        
        // Рассчитываем бонусные очки
        const sacrificePoints = gameState.clickPower * gameState.demonSacrifice * 2;
        addPoints(sacrificePoints);
        
        // Показываем уведомление
        showNotification(`😈 Демонический ритуал! x${gameState.demonSacrifice * 2} очков!`);
        
        // Сбрасываем счетчик жертв
        gameState.demonSacrifice = 0;
        
        // Удаляем эффекты через разное время
        setTimeout(() => ritualCircle.remove(), 3000);
        setTimeout(() => demonRunes.remove(), 2000);
        setTimeout(() => demonFlames.remove(), 1500);
    } else {
        // Обычный клик с накоплением жертв
        addPoints(gameState.clickPower);
        showNotification(`😈 Жертва ${gameState.demonSacrifice}/6`);
    }
    
    // Удаляем базовый эффект
    setTimeout(() => demonEnergy.remove(), 1000);
}

function handleDragonSkinClick() {
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем эффекты
    const aura = createEffect('dragon-aura');
    aura.style.left = (centerX - 200) + 'px';
    aura.style.top = (centerY - 200) + 'px';
    
    const flames = createEffect('dragon-flames');
    flames.style.left = (centerX - 150) + 'px';
    flames.style.top = (centerY - 150) + 'px';
    
    const sparks = createEffect('dragon-sparks');
    sparks.style.left = (centerX - 175) + 'px';
    sparks.style.top = (centerY - 175) + 'px';
    
    // Шанс критического удара
    if (Math.random() < 0.15) { // 15% шанс
        flames.classList.add('critical');
        let comboPoints = gameState.clickPower * 3;
        let comboCount = 1;
        
        // Комбо система
        const comboInterval = setInterval(() => {
            if (comboCount < 3) {
                addPoints(comboPoints);
                showNotification(`🐉 Комбо x${comboCount + 1}!`);
                comboCount++;
            } else {
                clearInterval(comboInterval);
            }
        }, 500);
    } else {
        addPoints(gameState.clickPower * 1.5);
    }
    
    // Удаляем эффекты
    setTimeout(() => aura.remove(), 2000);
    setTimeout(() => flames.remove(), 1500);
    setTimeout(() => sparks.remove(), 3000);
}

function handleGoldSkinClick() {
    if (!gameState.goldMultiplier) {
        gameState.goldMultiplier = 1;
        gameState.goldClicks = 0;
    }
    
    gameState.goldClicks++;
    const points = gameState.clickPower * gameState.goldMultiplier;
    
    // Каждые 10 кликов увеличиваем множитель
    if (gameState.goldClicks % 10 === 0) {
        gameState.goldMultiplier++;
        showNotification(`🌟 Золотой множитель: x${gameState.goldMultiplier}!`);
    }
    
    // Шанс золотой лихорадки
    if (Math.random() < 0.05) { // 5% шанс
        const feverPoints = points * 5;
        addPoints(feverPoints);
        showNotification('💰 Золотая лихорадка! x5 очков!');
        
        const goldEffect = document.createElement('div');
        goldEffect.className = 'gold-effect';
        document.body.appendChild(goldEffect);
        setTimeout(() => document.body.removeChild(goldEffect), 1000);
    } else {
        addPoints(points);
    }
}

// Ледяной скин: заморозка множителя
function handleIceSkinClick() {
    const freezeChance = 0.15; // 15% шанс заморозки
    const freezeDuration = 3000; // 3 секунды заморозки
    const unfreezeMultiplier = 1.5; // множитель при разморозке

    // Создаем эффект льда
    const iceEffect = document.createElement('div');
    iceEffect.className = 'ice-effect';
    document.querySelector('.effect-container').appendChild(iceEffect);
    
    setTimeout(() => iceEffect.remove(), 800);

    // Проверяем шанс заморозки
    if (Math.random() < freezeChance && !gameState.balanceFrozen) {
        // Замораживаем баланс
        gameState.balanceFrozen = true;
        gameState.frozenBalance = gameState.balance;
        
        // Добавляем визуальный эффект заморозки
        const balanceElement = document.querySelector('.status-value');
        balanceElement.classList.add('frozen-balance');
        
        // Показываем уведомление
        showNotification('Баланс заморожен на 3 секунды!');
        
        // Размораживаем через 3 секунды
        setTimeout(() => {
            gameState.balanceFrozen = false;
            
            // Убираем эффект заморозки
            balanceElement.classList.remove('frozen-balance');
            balanceElement.classList.add('unfreezing-balance');
            
            // Увеличиваем баланс в 1.5 раза
            const increase = (gameState.balance - gameState.frozenBalance) * unfreezeMultiplier;
            gameState.balance += increase;
            
            // Показываем уведомление о разморозке
            showNotification(`Баланс разморожен! Бонус: ${formatNumber(increase)}`);
            
            // Обновляем UI
            updateUI();
            
            // Убираем эффект разморозки через 500мс
            setTimeout(() => {
                balanceElement.classList.remove('unfreezing-balance');
            }, 500);
        }, freezeDuration);
    }
    
    // Если баланс не заморожен, добавляем очки как обычно
    if (!gameState.balanceFrozen) {
        addPoints(gameState.clickPower);
    }
}

// Матричный скин: система взлома
function handleMatrixSkinClick() {
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем эффект матричного дождя
    const matrixRain = createEffect('matrix-rain');
    matrixRain.style.left = (centerX - 150) + 'px';
    matrixRain.style.top = (centerY - 150) + 'px';
    
    // Добавляем эффект символов
    const matrixSymbols = createEffect('matrix-symbols');
    matrixSymbols.style.left = (centerX - 150) + 'px';
    matrixSymbols.style.top = (centerY - 150) + 'px';
    
    if (!gameState.matrixCode) {
        gameState.matrixCode = '';
        gameState.hackProgress = 0;
    }
    
    gameState.matrixCode += Math.random().toString(36).charAt(2);
    gameState.hackProgress++;
    
    if (gameState.hackProgress >= 6) {
        const hackPoints = gameState.clickPower * gameState.matrixCode.length * 2;
        addPoints(hackPoints);
        showNotification(`🖥️ Взлом успешен! Код: ${gameState.matrixCode}`);
        gameState.matrixCode = '';
        gameState.hackProgress = 0;
    } else {
        addPoints(gameState.clickPower);
        showNotification(`🔓 Взлом: ${gameState.hackProgress}/6`);
    }
    
    // Удаляем эффекты
    setTimeout(() => matrixRain.remove(), 1000);
    setTimeout(() => matrixSymbols.remove(), 2000);
}

// Плазменный скин: накопление энергии
function handlePlasmaSkinClick() {
    if (!gameState.plasmaCharge) {
        gameState.plasmaCharge = 0;
    }
    
    const plasmaEffect = document.createElement('div');
    plasmaEffect.className = 'plasma-effect';
    document.body.appendChild(plasmaEffect);
    
    gameState.plasmaCharge++;
    
    if (gameState.plasmaCharge >= 4) { // Разряд плазмы
        const plasmaPoints = gameState.clickPower * 4;
        addPoints(plasmaPoints);
        showNotification('⚡ Плазменный разряд!');
        gameState.plasmaCharge = 0;
        plasmaEffect.classList.add('discharge');
    } else {
        addPoints(gameState.clickPower);
        showNotification(`⚡ Заряд плазмы: ${gameState.plasmaCharge}/4`);
    }
    
    setTimeout(() => document.body.removeChild(plasmaEffect), 1000);
}

// Квантовый скин: случайные вероятности
function handleQuantumSkinClick() {
    const quantumEffect = document.createElement('div');
    quantumEffect.className = 'quantum-effect';
    document.body.appendChild(quantumEffect);
    
    const quantumState = Math.random();
    let points = gameState.clickPower;
    
    if (quantumState < 0.4) { // 40% шанс
        points *= 0.5;
        showNotification('🌌 Квантовая неудача: x0.5');
        quantumEffect.classList.add('quantum-fail');
    } else if (quantumState > 0.8) { // 20% шанс
        points *= 3;
        showNotification('🌌 Квантовый успех: x3');
        quantumEffect.classList.add('quantum-success');
    }
    
    addPoints(points);
    setTimeout(() => document.body.removeChild(quantumEffect), 1000);
}

function handleCyberSkinClick() {
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем эффекты
    const circuit = createEffect('cyber-circuit');
    circuit.style.left = (centerX - 150) + 'px';
    circuit.style.top = (centerY - 150) + 'px';
    
    const scan = createEffect('cyber-scan');
    scan.style.left = (centerX - 125) + 'px';
    scan.style.top = (centerY - 125) + 'px';
    
    const grid = createEffect('cyber-grid');
    grid.style.left = (centerX - 175) + 'px';
    grid.style.top = (centerY - 175) + 'px';
    
    // Шанс критического удара
    if (Math.random() < 0.2) { // 20% шанс
        const points = gameState.clickPower * 2;
        addPoints(points);
        showNotification('🤖 Критический удар! x2 очков');
    } else {
        addPoints(gameState.clickPower);
    }
    
    // Удаляем эффекты
    setTimeout(() => circuit.remove(), 2000);
    setTimeout(() => scan.remove(), 1500);
    setTimeout(() => grid.remove(), 2000);
}

function handleAngelSkinClick() {
    const button = document.getElementById('click-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем эффекты
    const light = createEffect('angel-light');
    light.style.left = (centerX - 200) + 'px';
    light.style.top = (centerY - 200) + 'px';
    
    const feathers = createEffect('angel-feathers');
    feathers.style.left = (centerX - 175) + 'px';
    feathers.style.top = (centerY - 175) + 'px';
    
    const halo = createEffect('angel-halo');
    halo.style.left = (centerX - 100) + 'px';
    halo.style.top = (centerY - 100) + 'px';
    
    // Система благословений
    if (!gameState.blessings) {
        gameState.blessings = 0;
        gameState.healingPower = 1;
    }
    
    gameState.blessings++;
    
    if (gameState.blessings >= 7) { // Божественное благословение
        const divinePoints = gameState.clickPower * gameState.healingPower * 3;
        addPoints(divinePoints);
        showNotification(`👼 Божественное благословение! x${gameState.healingPower * 3} очков!`);
        gameState.blessings = 0;
        gameState.healingPower += 0.2; // Увеличиваем силу исцеления
    } else {
        const points = gameState.clickPower * gameState.healingPower;
        addPoints(points);
        showNotification(`👼 Благословение ${gameState.blessings}/7`);
    }
    
    // Удаляем эффекты
    setTimeout(() => light.remove(), 3000);
    setTimeout(() => feathers.remove(), 4000);
    setTimeout(() => halo.remove(), 2000);
}

// Токсичный скин: отравление и мутации
function handleToxicSkinClick() {
    if (!gameState.toxicStacks) {
        gameState.toxicStacks = 0;
        gameState.mutations = 0;
    }
    
    const toxicEffect = document.createElement('div');
    toxicEffect.className = 'toxic-effect';
    document.body.appendChild(toxicEffect);
    
    gameState.toxicStacks++;
    
    if (gameState.toxicStacks >= 5) { // Мутация
        gameState.mutations++;
        const mutationPoints = gameState.clickPower * (2 * gameState.mutations);
        addPoints(mutationPoints);
        showNotification(`☢️ Мутация ${gameState.mutations}!`);
        gameState.toxicStacks = 0;
        toxicEffect.classList.add('mutation');
    } else {
        const points = gameState.clickPower * (1 + gameState.mutations * 0.2);
        addPoints(points);
        showNotification(`☢️ Токсичность: ${gameState.toxicStacks}/5`);
    }
    
    setTimeout(() => document.body.removeChild(toxicEffect), 1000);
}

// Теневой скин: поглощение и тени
function handleShadowSkinClick() {
    if (!gameState.shadowPower) {
        gameState.shadowPower = 0;
        gameState.shadowClones = 0;
    }
    
    const shadowEffect = document.createElement('div');
    shadowEffect.className = 'shadow-effect';
    document.body.appendChild(shadowEffect);
    
    gameState.shadowPower++;
    
    if (Math.random() < 0.2) { // 20% шанс создания теневого клона
        gameState.shadowClones++;
        showNotification(`👤 Теневой клон создан! (${gameState.shadowClones})`);
        shadowEffect.classList.add('clone');
    }
    
    const points = gameState.clickPower * (1 + (gameState.shadowPower * 0.1) + (gameState.shadowClones * 0.5));
    addPoints(points);
    
    setTimeout(() => document.body.removeChild(shadowEffect), 1000);
}

// Пустотный скин: поглощение энергии
function handleVoidSkinClick() {
    if (!gameState.voidEnergy) {
        gameState.voidEnergy = 0;
        gameState.voidPower = 1;
    }
    
    const voidEffect = createEffect('void-effect');
    
    gameState.voidEnergy++;
    
    if (gameState.voidEnergy >= 8) { // Высвобождение пустоты
        const voidPoints = gameState.clickPower * gameState.voidPower * 8;
        addPoints(voidPoints);
        showNotification(`🌌 Высвобождение пустоты x${gameState.voidPower}!`);
        gameState.voidEnergy = 0;
        gameState.voidPower++;
        voidEffect.classList.add('release');
    } else {
        const points = gameState.clickPower * gameState.voidPower;
        addPoints(points);
        showNotification(`🌌 Энергия пустоты: ${gameState.voidEnergy}/8`);
    }
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
    document.querySelector('.user-balance .status-value').textContent = formatNumber(gameState.balance);
    document.querySelector('.user-level .status-value').textContent = gameState.level;
    
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
        isAdmin: false,
        demonSacrifice: 0,
        goldMultiplier: 1,
        goldClicks: 0,
        iceFrozen: false,
        iceCombo: 0,
        frozenMultiplier: 1,
        matrixCode: '',
        hackProgress: 0,
        plasmaCharge: 0,
        voidEnergy: 0,
        voidPower: 1,
        blessings: 0,
        healingPower: 1,
        toxicStacks: 0,
        mutations: 0,
        shadowPower: 0,
        shadowClones: 0,
        balanceFrozen: false,
        frozenBalance: 0
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

// Инициализация режимов игры
function initGameModes() {
    console.log("Инициализация режимов игры...");
    
    // Инициализируем кликер
    initClickerScreen();
    
    // Обработчики для кнопок режимов
    document.querySelectorAll('.mode-button').forEach(button => {
        const mode = button.getAttribute('data-mode');
        button.addEventListener('click', function() {
            console.log("Выбран режим:", mode);
            switchGameMode(mode);
        });
    });

    // Обработчики для кнопок "Назад к играм"
    document.querySelectorAll('.back-to-modes').forEach(button => {
        button.addEventListener('click', function() {
            console.log("Возврат к выбору режимов");
            // Скрываем все экраны
            document.querySelectorAll('.content-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            // Показываем экран режимов
            document.getElementById('modes-screen').classList.add('active');
        });
    });
}

// Переключение режима игры
function switchGameMode(mode) {
    console.log("Переключение на режим:", mode);
    
    // Скрываем все экраны контента
    document.querySelectorAll('.content-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем экран выбранного режима
    const screenId = `${mode}-screen`;
    const modeScreen = document.getElementById(screenId);
    
    if (modeScreen) {
        modeScreen.classList.add('active');
        
        // Инициализируем выбранный режим
        switch(mode) {
            case 'clicker':
                // Кликер уже инициализирован в initClickerScreen
                break;
            case 'runner':
                initRunnerMode();
                break;
            case 'puzzle':
                initPuzzleMode();
                break;
            case 'space-battle':
                initSpaceBattleMode();
                break;
        }
        
        showNotification(`Режим "${GAME_MODES[mode]}" активирован!`);
    } else {
        console.error(`Экран режима ${mode} не найден!`);
    }
}

// Инициализация режима бегуна
function initRunnerMode() {
    const canvas = document.getElementById('runner-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = 300;
    
    let player = {
        x: 50,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        jumping: false,
        velocity: 0,
        jumpPower: -12,
        maxJumps: 2,
        jumpsLeft: 2
    };
    
    let obstacles = [];
    let coins = [];
    let isGameRunning = true;
    let gameSpeed = 5;
    let minObstacleSpacing = 300;
    let lastObstacleX = canvas.width;
    
    // Инициализация первых препятствий
    for (let i = 0; i < 3; i++) {
        spawnObstacle();
    }
    
    function spawnObstacle() {
        const minHeight = 30;
        const maxHeight = 80;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        
        // Добавляем разные типы препятствий
        const types = ['normal', 'spikes', 'moving'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: lastObstacleX + minObstacleSpacing,
            y: canvas.height - height,
            width: 30,
            height: height,
            type: type,
            moveDirection: 1,
            moveSpeed: 2
        });
        
        lastObstacleX += minObstacleSpacing;
    }
    
    function drawObstacle(obstacle) {
        switch(obstacle.type) {
            case 'normal':
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 'spikes':
                ctx.fillStyle = '#ff4400';
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width/2, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
                break;
            case 'moving':
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Движение вверх-вниз
                obstacle.y += obstacle.moveDirection * obstacle.moveSpeed;
                if (obstacle.y <= canvas.height - obstacle.height - 50 || 
                    obstacle.y >= canvas.height - obstacle.height) {
                    obstacle.moveDirection *= -1;
                }
                break;
        }
    }
    
    function gameStep() {
        if (!isGameRunning) return;
        
        // Очистка канваса
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Обновление позиции игрока
        if (player.jumping) {
            player.velocity += 0.6; // Уменьшенная гравитация
            player.y += player.velocity;
            
            // Проверка приземления
            if (player.y > canvas.height - 50) {
                player.y = canvas.height - 50;
                player.jumping = false;
                player.velocity = 0;
                player.jumpsLeft = player.maxJumps; // Восстановление прыжков
            }
        }
        
        // Отрисовка игрока
        ctx.fillStyle = '#0d4cd3';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Обновление и отрисовка препятствий
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= gameSpeed;
            drawObstacle(obstacle);
            
            // Проверка столкновений с учетом погрешности
            if (checkCollision(player, obstacle)) {
                gameOver();
            }
            
            // Удаление препятствий за пределами экрана
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
            }
        });
        
        // Обновление и отрисовка монет
        coins.forEach((coin, index) => {
            coin.x -= gameSpeed;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Сбор монет
            if (checkCoinCollision(player, coin)) {
                gameModesState.runner.coins++;
                coins.splice(index, 1);
                showNotification('+1 монета!');
            }
            
            if (coin.x + coin.radius < 0) {
                coins.splice(index, 1);
            }
        });
        
        // Генерация новых препятствий с увеличением сложности
        if (lastObstacleX - gameSpeed <= canvas.width && 
            canvas.width - lastObstacleX >= minObstacleSpacing) {
            spawnObstacle();
        }
        
        // Генерация монет между препятствиями
        if (Math.random() < 0.03) {
            spawnCoin();
        }
        
        // Увеличение скорости игры со временем
        gameSpeed += 0.001;
        
        // Обновление счета
        gameModesState.runner.distance += gameSpeed / 50;
        gameModesState.runner.score = Math.floor(gameModesState.runner.distance) + gameModesState.runner.coins * 10;
        
        // Отображение счета и подсказок
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(`Счет: ${Math.floor(gameModesState.runner.score)}`, 10, 30);
        ctx.fillText(`Монеты: ${gameModesState.runner.coins}`, 10, 60);
        ctx.fillText(`Прыжков: ${player.jumpsLeft}`, 10, 90);
        
        requestAnimationFrame(gameStep);
    }
    
    function checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }
    
    function checkCoinCollision(player, coin) {
        const dx = (player.x + player.width/2) - coin.x;
        const dy = (player.y + player.height/2) - coin.y;
        return Math.sqrt(dx*dx + dy*dy) < coin.radius + player.width/2;
    }
    
    function gameOver() {
        isGameRunning = false;
        showNotification(`Игра окончена! Счет: ${Math.floor(gameModesState.runner.score)}`);
        
        // Добавляем очки к общему балансу
        gameState.balance += Math.floor(gameModesState.runner.score);
        saveGameState();
        
        // Сброс состояния игры
        setTimeout(() => {
            gameModesState.runner = {
                score: 0,
                coins: 0,
                distance: 0,
                obstacles: []
            };
            obstacles = [];
            coins = [];
            player.y = canvas.height - 50;
            player.jumping = false;
            isGameRunning = true;
            gameStep();
        }, 2000);
    }
    
    function spawnCoin() {
        const minY = 50;
        const maxY = canvas.height - 100;
        
        coins.push({
            x: canvas.width,
            y: Math.random() * (maxY - minY) + minY,
            radius: 10
        });
    }
    
    gameStep();
}

// Инициализация режима головоломки
function initPuzzleMode() {
    const puzzleContainer = document.getElementById('puzzle-container');
    let currentPuzzle = null;
    
    // Генерация новой головоломки
    function generatePuzzle() {
        const puzzleTypes = [
            'math', 'word', 'pattern', 'sequence', 'logic', 'color',
            'memory', 'riddle', 'image', 'music'
        ];
        const type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
        
        switch(type) {
            case 'math':
                return generateMathPuzzle();
            case 'word':
                return generateWordPuzzle();
            case 'pattern':
                return generatePatternPuzzle();
            case 'sequence':
                return generateSequencePuzzle();
            case 'logic':
                return generateLogicPuzzle();
            case 'color':
                return generateColorPuzzle();
            case 'memory':
                return generateMemoryPuzzle();
            case 'riddle':
                return generateRiddlePuzzle();
            case 'image':
                return generateImagePuzzle();
            case 'music':
                return generateMusicPuzzle();
        }
    }

    function generateMathPuzzle() {
        const operations = [
            {op: '+', max: 50},
            {op: '-', max: 50},
            {op: '*', max: 12},
            {op: '/', divisible: true},
            {op: '^', max: 5},  // Возведение в степень
            {op: '√', max: 100} // Квадратный корень
        ];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;
        
        switch(operation.op) {
            case '+':
                num1 = Math.floor(Math.random() * operation.max) + 1;
                num2 = Math.floor(Math.random() * operation.max) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * operation.max) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * operation.max) + 1;
                num2 = Math.floor(Math.random() * operation.max) + 1;
                answer = num1 * num2;
                break;
            case '/':
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * answer;
                break;
            case '^':
                num1 = Math.floor(Math.random() * operation.max) + 1;
                num2 = Math.floor(Math.random() * 3) + 2;
                answer = Math.pow(num1, num2);
                break;
            case '√':
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = answer * answer;
                break;
        }
        
        const question = operation.op === '√' ? 
            `√${num1} = ?` : 
            `${num1} ${operation.op} ${num2} = ?`;
        
        return {
            type: 'math',
            question: question,
            answer: answer.toString(),
            reward: 50 * (operation.op === '*' || operation.op === '/' ? 2 : 
                         operation.op === '^' || operation.op === '√' ? 3 : 1)
        };
    }

    function generateWordPuzzle() {
        const words = [
            {word: 'ИГРА', hint: 'То, во что вы сейчас играете'},
            {word: 'КЛИК', hint: 'Основное действие в кликере'},
            {word: 'ОЧКИ', hint: 'Зарабатываются за действия в игре'},
            {word: 'СКИН', hint: 'Меняет внешний вид кнопки'},
            {word: 'БОНУС', hint: 'Дополнительная награда'},
            {word: 'РЕЖИМ', hint: 'Разные варианты игры'},
            {word: 'ПАЗЛ', hint: 'Собирать части в целое'},
            {word: 'СЧЕТ', hint: 'Показывает ваш результат'},
            {word: 'УРОВЕНЬ', hint: 'Показатель прогресса игрока'},
            {word: 'МОНЕТА', hint: 'Ценный предмет в играх'},
            {word: 'РЕКОРД', hint: 'Лучший результат'},
            {word: 'ПОБЕДА', hint: 'Успешное завершение'},
            {word: 'МАГАЗИН', hint: 'Место для покупок в игре'},
            {word: 'НАГРАДА', hint: 'Получаете за достижения'}
        ];
        
        const puzzleTypes = [
            'scramble',    // Перемешанные буквы
            'missing',     // Пропущенные буквы
            'reverse',     // Слово наоборот
            'first_last'   // Первая и последняя буквы
        ];
        
        const puzzle = words[Math.floor(Math.random() * words.length)];
        const type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
        let question;
        
        switch(type) {
            case 'scramble':
                question = `Разгадайте слово: ${puzzle.word.split('').sort(() => Math.random() - 0.5).join('')}`;
                break;
            case 'missing':
                const word = puzzle.word.split('');
                const missingIndex = Math.floor(Math.random() * word.length);
                word[missingIndex] = '_';
                question = `Вставьте пропущенную букву: ${word.join('')}`;
                break;
            case 'reverse':
                question = `Прочитайте слово справа налево: ${puzzle.word.split('').reverse().join('')}`;
                break;
            case 'first_last':
                const firstLast = puzzle.word[0] + '...' + puzzle.word[puzzle.word.length - 1];
                question = `Угадайте слово по первой и последней букве: ${firstLast}`;
                break;
        }
        
        return {
            type: 'word',
            question: `${question}\nПодсказка: ${puzzle.hint}`,
            answer: puzzle.word,
            reward: 100 + (type === 'first_last' ? 50 : 0)
        };
    }

    function generateRiddlePuzzle() {
        const riddles = [
            {
                question: 'Что может путешествовать по миру, оставаясь в одном углу?',
                answer: 'МАРКА',
                hint: 'Используется для отправки писем'
            },
            {
                question: 'Что становится больше, если его перевернуть вверх ногами?',
                answer: '6',
                hint: 'Это число'
            },
            {
                question: 'Что может бежать, но не может ходить?',
                answer: 'ВОДА',
                hint: 'Жидкость'
            },
            {
                question: 'Какой месяц года имеет 28 дней?',
                answer: 'ВСЕ',
                hint: 'Подумайте о календаре'
            },
            {
                question: 'Что всегда увеличивается, но никогда не уменьшается?',
                answer: 'ВОЗРАСТ',
                hint: 'Связано со временем'
            }
        ];
        
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        return {
            type: 'riddle',
            question: `${riddle.question}\nПодсказка: ${riddle.hint}`,
            answer: riddle.answer,
            reward: 200
        };
    }

    function generateMemoryPuzzle() {
        const sequences = [
            {
                items: '🎮 🎲 🎯 🎨',
                type: 'emoji',
                length: 4
            },
            {
                items: '🔵 🔴 🟡 🟢 ⚫',
                type: 'colors',
                length: 5
            },
            {
                items: '1 2 3 4 5 6 7 8 9',
                type: 'numbers',
                length: 6
            }
        ];
        
        const sequence = sequences[Math.floor(Math.random() * sequences.length)];
        const items = sequence.items.split(' ');
        const memorySequence = [];
        
        for (let i = 0; i < sequence.length; i++) {
            memorySequence.push(items[Math.floor(Math.random() * items.length)]);
        }
        
        return {
            type: 'memory',
            question: `Запомните последовательность за 5 секунд:\n${memorySequence.join(' ')}\n\nПоследовательность исчезнет через 5 секунд...`,
            answer: memorySequence.join(''),
            reward: 150 * Math.floor(sequence.length / 2)
        };
    }

    function generateImagePuzzle() {
        const puzzles = [
            {
                image: `
⬜⬛⬜⬛
⬛⬜⬛⬜
⬜⬛⬜⬛
⬛⬜⬛⬜`,
                question: 'Сколько черных квадратов на изображении?',
                answer: '8'
            },
            {
                image: `
  🔺
 🔺🔺
🔺🔺🔺`,
                question: 'Сколько треугольников на изображении?',
                answer: '6'
            },
            {
                image: `
🌟
🎮🎮
🎮🎮🎮`,
                question: 'Сколько игровых контроллеров на изображении?',
                answer: '5'
            }
        ];
        
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        return {
            type: 'image',
            question: `${puzzle.image}\n\n${puzzle.question}`,
            answer: puzzle.answer,
            reward: 175
        };
    }

    function generateMusicPuzzle() {
        const notes = [
            {sequence: '🎵 🎵 🎵 🎶', answer: '4'},
            {sequence: '🎼 🎵 🎶 🎵 🎶', answer: '5'},
            {sequence: '🎵 🎶 🎵 🎶 🎵 🎶', answer: '6'}
        ];
        
        const puzzle = notes[Math.floor(Math.random() * notes.length)];
        
        return {
            type: 'music',
            question: `Сколько музыкальных символов в последовательности?\n${puzzle.sequence}`,
            answer: puzzle.answer,
            reward: 125
        };
    }

    function showPuzzle() {
        currentPuzzle = generatePuzzle();
        
        // Специальная обработка для головоломки на запоминание
        if (currentPuzzle.type === 'memory') {
            puzzleContainer.innerHTML = `
                <div class="puzzle-card">
                    <h3>Уровень ${gameModesState.puzzle.level}</h3>
                    <p class="puzzle-question">${currentPuzzle.question}</p>
                    <div id="memory-input" style="display: none;">
                        <input type="text" id="puzzle-answer" placeholder="Введите последовательность">
                        <button id="submit-answer">Проверить</button>
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                document.querySelector('.puzzle-question').textContent = 'Введите последовательность, которую вы запомнили:';
                document.getElementById('memory-input').style.display = 'block';
            }, 5000);
        } else {
            puzzleContainer.innerHTML = `
                <div class="puzzle-card">
                    <h3>Уровень ${gameModesState.puzzle.level}</h3>
                    <p class="puzzle-question">${currentPuzzle.question}</p>
                    <input type="text" id="puzzle-answer" placeholder="Ваш ответ">
                    <button id="submit-answer">Проверить</button>
                </div>
            `;
        }
        
        document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    }
    
    function checkAnswer() {
        const userAnswer = document.getElementById('puzzle-answer').value.toUpperCase();
        
        if (userAnswer === currentPuzzle.answer) {
            gameModesState.puzzle.solved++;
            gameModesState.puzzle.level++;
            gameState.balance += currentPuzzle.reward;
            
            showNotification(`Правильно! +${currentPuzzle.reward} очков`);
            saveGameState();
            
            // Показываем следующую головоломку
            setTimeout(showPuzzle, 1500);
        } else {
            showNotification('Неправильно, попробуйте еще раз');
        }
    }
    
    showPuzzle();
}

// Инициализация режима космического боя
function initSpaceBattleMode() {
    const canvas = document.getElementById('space-battle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = 400;
    
    // Добавляем объект для отслеживания нажатых клавиш
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        Space: false
    };
    
    let player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 40,
        height: 40,
        speed: 8,
        bullets: [],
        shootCooldown: 0,
        powerups: []
    };
    
    let enemies = [];
    let powerups = [];
    let isGameRunning = true;
    
    // Обработчики клавиш
    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });
    
    function gameStep() {
        if (!isGameRunning) return;
        
        // Очистка канваса
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовка космического фона
        drawSpace();
        
        // Обновление и отрисовка игрока
        updatePlayer();
        
        // Обновление и отрисовка пуль
        updateBullets();
        
        // Обновление и отрисовка врагов
        updateEnemies();
        
        // Обновление и отрисовка бонусов
        updatePowerups();
        
        // Генерация новых врагов с увеличением сложности
        if (Math.random() < enemySpawnRate) {
            spawnEnemy();
        }
        
        // Генерация бонусов
        if (Math.random() < 0.005) {
            spawnPowerup();
        }
        
        // Увеличение сложности со временем
        enemySpawnRate = Math.min(0.05, 0.02 + score / 1000);
        
        // Отображение статистики
        drawStats();
        
        requestAnimationFrame(gameStep);
    }
    
    function updatePlayer() {
        // Обновление позиции игрока
        if (keys.ArrowLeft && player.x > 20) player.x -= player.speed;
        if (keys.ArrowRight && player.x < canvas.width - 20) player.x += player.speed;
        
        // Стрельба
        if (keys.Space && player.shootCooldown <= 0) {
            shoot();
            player.shootCooldown = 10;
        }
        if (player.shootCooldown > 0) player.shootCooldown--;
        
        // Отрисовка игрока
        drawPlayer();
    }
    
    function shoot() {
        // Стандартный выстрел
        player.bullets.push({
            x: player.x,
            y: player.y,
            speed: 10,
            power: 1
        });
        
        // Если есть бонус тройного выстрела
        if (player.powerups.includes('triple')) {
            player.bullets.push({
                x: player.x - 10,
                y: player.y,
                speed: 10,
                power: 1
            });
            player.bullets.push({
                x: player.x + 10,
                y: player.y,
                speed: 10,
                power: 1
            });
        }
    }
    
    function spawnPowerup() {
        const types = ['triple', 'speed', 'shield'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const powerup = {
            x: Math.random() * (canvas.width - 20) + 10,
            y: -20,
            type: type,
            width: 20,
            height: 20,
            speed: 2
        };
        
        powerups.push(powerup);
    }
    
    function updatePowerups() {
        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];
            powerup.y += powerup.speed;
            
            // Отрисовка бонуса
            ctx.fillStyle = getPowerupColor(powerup.type);
            ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
            
            // Проверка столкновения с игроком
            if (checkCollision(player, powerup)) {
                activatePowerup(powerup.type);
                powerups.splice(i, 1);
            }
            
            // Удаление бонусов за пределами экрана
            if (powerup.y > canvas.height) {
                powerups.splice(i, 1);
            }
        }
    }
    
    function activatePowerup(type) {
        player.powerups.push(type);
        
        // Бонус действует 10 секунд
        setTimeout(() => {
            const index = player.powerups.indexOf(type);
            if (index !== -1) {
                player.powerups.splice(index, 1);
            }
        }, 10000);
        
        showNotification(`Активирован бонус: ${getPowerupName(type)}!`);
    }
    
    function getPowerupColor(type) {
        switch(type) {
            case 'triple': return '#ff0';
            case 'speed': return '#0f0';
            case 'shield': return '#00f';
            default: return '#fff';
        }
    }
    
    function getPowerupName(type) {
        switch(type) {
            case 'triple': return 'Тройной выстрел';
            case 'speed': return 'Ускорение';
            case 'shield': return 'Щит';
            default: return 'Неизвестный бонус';
        }
    }
    
    function drawSpace() {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Звезды
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1,
                1
            );
        }
    }
    
    function drawPlayer() {
        ctx.fillStyle = '#0d4cd3';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x - 20, player.y + 40);
        ctx.lineTo(player.x + 20, player.y + 40);
        ctx.closePath();
        ctx.fill();
    }
    
    function updateBullets() {
        for (let i = player.bullets.length - 1; i >= 0; i--) {
            const bullet = player.bullets[i];
            bullet.y -= 10;
            
            // Отрисовка пули
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 8);
            
            // Проверка столкновений с врагами
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (checkBulletCollision(bullet, enemy)) {
                    enemies.splice(j, 1);
                    player.bullets.splice(i, 1);
                    gameModesState['space-battle'].score += 10;
                    break;
                }
            }
            
            // Удаление пуль за пределами экрана
            if (bullet.y < 0) {
                player.bullets.splice(i, 1);
            }
        }
    }
    
    function updateEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.y += enemy.speed;
            
            // Отрисовка врага
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(enemy.x, enemy.y);
            ctx.lineTo(enemy.x - 15, enemy.y - 30);
            ctx.lineTo(enemy.x + 15, enemy.y - 30);
            ctx.closePath();
            ctx.fill();
            
            // Проверка столкновения с игроком
            if (checkPlayerCollision(enemy)) {
                gameOver();
                return;
            }
            
            // Удаление врагов за пределами экрана
            if (enemy.y > canvas.height) {
                enemies.splice(i, 1);
                gameModesState['space-battle'].health -= 10;
                
                if (gameModesState['space-battle'].health <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }
    
    function spawnEnemy() {
        enemies.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 2
        });
    }
    
    function drawStats() {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Счет: ${gameModesState['space-battle'].score}`, 10, 30);
        ctx.fillText(`Здоровье: ${gameModesState['space-battle'].health}%`, 10, 60);
        ctx.fillText(`Уровень: ${gameModesState['space-battle'].level}`, 10, 90);
    }
    
    function checkBulletCollision(bullet, enemy) {
        return bullet.x > enemy.x - 15 &&
               bullet.x < enemy.x + 15 &&
               bullet.y > enemy.y - 30 &&
               bullet.y < enemy.y;
    }
    
    function checkPlayerCollision(enemy) {
        return player.x > enemy.x - 15 &&
               player.x < enemy.x + 15 &&
               player.y > enemy.y - 30 &&
               player.y < enemy.y;
    }
    
    function gameOver() {
        isGameRunning = false;
        showNotification(`Игра окончена! Счет: ${gameModesState['space-battle'].score}`);
        
        // Добавляем очки к общему балансу
        gameState.balance += gameModesState['space-battle'].score;
        saveGameState();
        
        // Сброс состояния игры
        setTimeout(() => {
            gameModesState['space-battle'] = {
                score: 0,
                level: 1,
                health: 100,
                enemies: []
            };
            enemies = [];
            player.bullets = [];
            isGameRunning = true;
            gameStep();
        }, 2000);
    }
    
    gameStep();
}

// Добавляем обработчики клавиш для игровых режимов
document.addEventListener('keydown', function(event) {
    // Для режима бегуна
    if (document.getElementById('runner-screen').classList.contains('active')) {
        if (event.code === 'Space' && !event.repeat) {
            event.preventDefault();
            const player = gameModesState.runner.player;
            if (player.jumpsLeft > 0) {
                player.jumping = true;
                player.velocity = player.jumpPower;
                player.jumpsLeft--;
            }
        }
    }
    
    // Для режима космического боя
    if (document.getElementById('space-battle-screen').classList.contains('active')) {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'Space') {
            event.preventDefault();
            gameModesState['space-battle'].keys[event.code] = true;
        }
    }
});

document.addEventListener('keyup', function(event) {
    // Для режима космического боя
    if (document.getElementById('space-battle-screen').classList.contains('active')) {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'Space') {
            gameModesState['space-battle'].keys[event.code] = false;
        }
    }
});

// Добавляем обработчики для мобильных устройств
document.addEventListener('touchstart', function(event) {
    if (document.getElementById('runner-screen').classList.contains('active')) {
        event.preventDefault();
        const player = gameModesState.runner.player;
        if (player.jumpsLeft > 0) {
            player.jumping = true;
            player.velocity = player.jumpPower;
            player.jumpsLeft--;
        }
    }
    
    if (document.getElementById('space-battle-screen').classList.contains('active')) {
        const touch = event.touches[0];
        const centerX = window.innerWidth / 2;
        
        if (touch.clientX < centerX) {
            gameModesState['space-battle'].keys.ArrowLeft = true;
        } else {
            gameModesState['space-battle'].keys.ArrowRight = true;
        }
        gameModesState['space-battle'].keys.Space = true;
    }
});

document.addEventListener('touchend', function(event) {
    if (document.getElementById('space-battle-screen').classList.contains('active')) {
        gameModesState['space-battle'].keys.ArrowLeft = false;
        gameModesState['space-battle'].keys.ArrowRight = false;
        gameModesState['space-battle'].keys.Space = false;
    }

});
