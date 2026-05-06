// 精确转换系数
const BAR_TO_MPA = 0.1;        // 1 bar = 0.1 MPa
const BAR_TO_PSI = 14.5038;    // 1 bar = 14.5038 psi

// 获取三个输入框
const barInput = document.getElementById('bar');
const mpaInput = document.getElementById('mpa');
const psiInput = document.getElementById('psi');

// 防止无限循环的标志
let updating = false;

// 当用户在 bar 输入时，更新 MPa 和 psi
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

// 当用户在 MPa 输入时，更新 bar 和 psi
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

// 当用户在 psi 输入时，更新 bar 和 MPa
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

// 监听输入事件
barInput.addEventListener('input', (e) => updateFromBar(e.target.value));
mpaInput.addEventListener('input', (e) => updateFromMpa(e.target.value));
psiInput.addEventListener('input', (e) => updateFromPsi(e.target.value));