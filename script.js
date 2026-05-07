// 精确转换系数
const BAR_TO_MPA = 0.1;
const BAR_TO_PSI = 14.5038;

// DOM 元素
const barInput = document.getElementById('bar');
const mpaInput = document.getElementById('mpa');
const psiInput = document.getElementById('psi');
const clearBtn = document.getElementById('clearBtn');

// 头像相关
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');
const appTitle = document.getElementById('appTitle');

// 颜色相关
const colorPicker = document.getElementById('colorPicker');
const applyColorBtn = document.getElementById('applyColorBtn');
const randomColorBtn = document.getElementById('randomColorBtn');
const saveSchemeBtn = document.getElementById('saveSchemeBtn');
const schemeBtns = document.querySelectorAll('.scheme-btn');

let updating = false;

// ========== 单位转换逻辑 ==========
function updateFromBar(value) {
    if (updating) return;
    updating = true;
    const bar = parseFloat(value);
    if (isNaN(bar)) {
        mpaInput.value = '';
        psiInput.value = '';
    } else {
        mpaInput.value = (bar * BAR_TO_MPA).toFixed(6);
        psiInput.value = (bar * BAR_TO_PSI).toFixed(6);
    }
    updating = false;
}

function updateFromMpa(value) {
    if (updating) return;
    updating = true;
    const mpa = parseFloat(value);
    if (isNaN(mpa)) {
        barInput.value = '';
        psiInput.value = '';
    } else {
        const bar = mpa / BAR_TO_MPA;
        barInput.value = bar.toFixed(6);
        psiInput.value = (bar * BAR_TO_PSI).toFixed(6);
    }
    updating = false;
}

function updateFromPsi(value) {
    if (updating) return;
    updating = true;
    const psi = parseFloat(value);
    if (isNaN(psi)) {
        barInput.value = '';
        mpaInput.value = '';
    } else {
        const bar = psi / BAR_TO_PSI;
        barInput.value = bar.toFixed(6);
        mpaInput.value = (bar * BAR_TO_MPA).toFixed(6);
    }
    updating = false;
}

function clearAll() {
    if (updating) return;
    updating = true;
    barInput.value = '';
    mpaInput.value = '';
    psiInput.value = '';
    updating = false;
}

// ========== 头像选择功能 ==========
// 加载保存的头像
function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
        avatarBtn.textContent = savedAvatar;
    }
}

// 切换头像下拉菜单
avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarDropdown.classList.toggle('show');
});

// 选择头像
document.querySelectorAll('.avatar-option').forEach(option => {
    option.addEventListener('click', () => {
        const avatar = option.getAttribute('data-avatar');
        avatarBtn.textContent = avatar;
        localStorage.setItem('selectedAvatar', avatar);
        avatarDropdown.classList.remove('show');
    });
});

// 点击其他地方关闭下拉菜单
document.addEventListener('click', () => {
    avatarDropdown.classList.remove('show');
});

// ========== 主题颜色功能 ==========
// 应用渐变颜色
function applyGradient(color1, color2) {
    document.body.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

// 从单个颜色生成渐变（自动搭配）
function generateGradient(baseColor) {
    // 简单的颜色变暗处理（生成第二个颜色）
    const darkerColor = adjustColor(baseColor, -30);
    return [baseColor, darkerColor];
}

// 颜色调整函数（亮度调整）
function adjustColor(color, percent) {
    // 将 hex 转为 rgb
    let r, g, b;
    if (color.startsWith('#')) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
    } else {
        return color;
    }
    
    // 调整亮度
    r = Math.min(255, Math.max(0, r + percent));
    g = Math.min(255, Math.max(0, g + percent));
    b = Math.min(255, Math.max(0, b + percent));
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 应用自选颜色
function applyCustomColor() {
    const baseColor = colorPicker.value;
    const [color1, color2] = generateGradient(baseColor);
    applyGradient(color1, color2);
    // 保存当前颜色到 localStorage
    localStorage.setItem('customColor', baseColor);
}

// 随机组合（随机选择两个颜色）
function randomGradient() {
    const randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    applyGradient(randomColor1, randomColor2);
    // 保存随机配色方案
    localStorage.setItem('randomColor1', randomColor1);
    localStorage.setItem('randomColor2', randomColor2);
}

// 预设颜色快捷选择
document.querySelectorAll('.preset-color').forEach(btn => {
    btn.addEventListener('click', () => {
        const bgColor = btn.style.backgroundColor;
        if (bgColor && bgColor !== 'none') {
            // 将 rgb 转为 hex 并应用
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
                const hex = `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`;
                const [color1, color2] = generateGradient(hex);
                applyGradient(color1, color2);
                localStorage.setItem('customColor', hex);
            }
        } else {
            // 如果没有获取到背景色，直接使用预设色值
            const colorMap = {
                '#667eea': '#667eea',
                '#f472b6': '#f472b6',
                '#34d399': '#34d399',
                '#fb923c': '#fb923c',
                '#a855f7': '#a855f7',
                '#ef4444': '#ef4444',
                '#06b6d4': '#06b6d4',
                '#84cc16': '#84cc16'
            };
            const color = Object.values(colorMap)[0];
            if (color) {
                const [color1, color2] = generateGradient(color);
                applyGradient(color1, color2);
                localStorage.setItem('customColor', color);
            }
        }
    });
});

// 保存当前配色方案
function saveCurrentScheme(index) {
    const currentBg = document.body.style.background;
    if (currentBg) {
        const schemes = JSON.parse(localStorage.getItem('colorSchemes') || '{}');
        schemes[index] = currentBg;
        localStorage.setItem('colorSchemes', JSON.stringify(schemes));
        alert(`配色方案 ${parseInt(index) + 1} 已保存！`);
    } else {
        alert('请先选择一种颜色');
    }
}

// 加载保存的配色方案
function loadScheme(index) {
    const schemes = JSON.parse(localStorage.getItem('colorSchemes') || '{}');
    const savedBg = schemes[index];
    if (savedBg) {
        document.body.style.background = savedBg;
    } else {
        alert(`方案 ${parseInt(index) + 1} 尚未保存，请先保存配色`);
    }
}

// 加载保存的颜色
function loadSavedColor() {
    const savedColor = localStorage.getItem('customColor');
    if (savedColor) {
        const [color1, color2] = generateGradient(savedColor);
        applyGradient(color1, color2);
        colorPicker.value = savedColor;
    }
}

// 绑定事件
barInput.addEventListener('input', (e) => updateFromBar(e.target.value));
mpaInput.addEventListener('input', (e) => updateFromMpa(e.target.value));
psiInput.addEventListener('input', (e) => updateFromPsi(e.target.value));
clearBtn.addEventListener('click', clearAll);

applyColorBtn.addEventListener('click', applyCustomColor);
randomColorBtn.addEventListener('click', randomGradient);

saveSchemeBtn.addEventListener('click', () => {
    const index = prompt('保存到哪个方案？(1, 2, 3)', '1');
    if (index && index >= 1 && index <= 3) {
        saveCurrentScheme(index - 1);
    } else {
        alert('请输入 1-3 的数字');
    }
});

schemeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => loadScheme(idx));
});

// 页面加载时恢复设置
loadSavedAvatar();
loadSavedColor();

// 处理预设按钮无法正确读取背景色的问题 - 改为点击时直接设置
const presetColorsList = document.querySelectorAll('.preset-color');
const presetColorValues = ['#667eea', '#f472b6', '#34d399', '#fb923c', '#a855f7', '#ef4444', '#06b6d4', '#84cc16'];
presetColorsList.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const color = presetColorValues[i];
        if (color) {
            const [color1, color2] = generateGradient(color);
            applyGradient(color1, color2);
            localStorage.setItem('customColor', color);
            colorPicker.value = color;
        }
    });
});
