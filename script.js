// 精确转换系数
const BAR_TO_MPA = 0.1;        // 1 bar = 0.1 MPa
const BAR_TO_PSI = 14.5038;    // 1 bar = 14.5038 psi

// 获取三个输入框
const barInput = document.getElementById('bar');
const mpaInput = document.getElementById('mpa');
const psiInput = document.getElementById('psi');

// 获取清零按钮
const clearBtn = document.getElementById('clearBtn');

// 防止无限循环的标志
let updating = false;

// 从 bar 更新所有
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

// 从 MPa 更新
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

// 从 psi 更新
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

// 一键清零功能
function clearAll() {
    if (updating) return;
    updating = true;
    
    barInput.value = '';
    mpaInput.value = '';
    psiInput.value = '';
    
    updating = false;
}

// 主题切换功能
function changeTheme(themeName) {
    // 移除所有主题class
    document.body.classList.remove('theme-pink', 'theme-green', 'theme-orange', 'theme-purple');
    
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    // 保存用户选择的主题到本地
    localStorage.setItem('selectedTheme', themeName);
}

// 加载保存的主题
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && savedTheme !== 'default') {
        document.body.classList.add(`theme-${savedTheme}`);
    }
}

// 绑定事件
barInput.addEventListener('input', (e) => updateFromBar(e.target.value));
mpaInput.addEventListener('input', (e) => updateFromMpa(e.target.value));
psiInput.addEventListener('input', (e) => updateFromPsi(e.target.value));
clearBtn.addEventListener('click', clearAll);

// 绑定颜色按钮事件
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        changeTheme(color);
    });
});

// 页面加载时恢复上次选择的主题
loadSavedTheme();
