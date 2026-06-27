// ============================================================
//  BASE64 ENCODER / DECODER - APP
//  Matrice 2x2: Encode | Encoded | Decode | Decoded
// ============================================================

// ===== PARTICLES =====
(function createParticles() {
    const container = document.getElementById('particles');
    const count = 50;
    const colors = [
        'rgba(46, 213, 115, 0.35)',
        'rgba(79, 172, 254, 0.25)',
        'rgba(255, 255, 255, 0.15)',
        'rgba(102, 126, 234, 0.25)'
    ];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 17 + 10;
        particle.style.animationDuration = duration + 's';
        const delay = Math.random() * 3;
        particle.style.animationDelay = delay + 's';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        container.appendChild(particle);
    }
})();

// ===== DOM ELEMENTS =====
const inputText = document.getElementById('input-text');
const encodedText = document.getElementById('encoded-text');
const decodeText = document.getElementById('decode-text');
const decodedText = document.getElementById('decoded-text');

const inputCount = document.getElementById('input-count');
const encodedCount = document.getElementById('encoded-count');
const decodeInputCount = document.getElementById('decode-input-count');
const decodedCount = document.getElementById('decoded-count');

const encodeBtn = document.getElementById('encode-btn');
const decodeBtn = document.getElementById('decode-btn');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');

const liveMode = document.getElementById('live-mode');
const urlSafe = document.getElementById('url-safe');
const wrapLines = document.getElementById('wrap-lines');
const newlineMode = document.getElementById('newline-mode');
const liveDot = document.getElementById('live-dot');
const liveStatus = document.getElementById('live-status');

// ===== TOAST =====
function showToast(message, type = 'success') {
    const oldToasts = document.querySelectorAll('.toast');
    oldToasts.forEach(t => {
        t.classList.add('toast-hide');
        setTimeout(() => t.remove(), 500);
    });

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 500);
    }, 2800);
}

// ===== BASE64 FUNCTIONS =====
function toBase64(str) {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch {
        return btoa(str);
    }
}

function fromBase64(str) {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch {
        return atob(str);
    }
}

function toBase64URL(str) {
    return toBase64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64URL(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return fromBase64(base64);
}

function wrapText(text, width = 76) {
    if (!wrapLines.checked) return text;
    return text.replace(/(.{76})/g, '$1\n').trim();
}

function getNewline(text) {
    switch (newlineMode.value) {
        case 'crlf': return text.replace(/\n/g, '\r\n');
        case 'none': return text.replace(/\n/g, '');
        default: return text;
    }
}

// ===== PROCESS =====
function processEncode() {
    const input = inputText.value;
    if (!input) {
        encodedText.value = '';
        updateCounts();
        return;
    }
    try {
        const useUrlSafe = urlSafe.checked;
        let result = useUrlSafe ? toBase64URL(input) : toBase64(input);
        result = wrapText(result);
        result = getNewline(result);
        encodedText.value = result;
    } catch (e) {
        encodedText.value = '❌ Error: ' + e.message;
    }
    updateCounts();
}

function processDecode() {
    const input = decodeText.value;
    if (!input) {
        decodedText.value = '';
        updateCounts();
        return;
    }
    try {
        const useUrlSafe = urlSafe.checked;
        let result = useUrlSafe ? fromBase64URL(input) : fromBase64(input);
        decodedText.value = result;
    } catch (e) {
        decodedText.value = '❌ Error: ' + e.message;
    }
    updateCounts();
}

function processAll() {
    processEncode();
    processDecode();
}

// ===== UPDATE COUNTS =====
function updateCounts() {
    inputCount.textContent = inputText.value.length;
    encodedCount.textContent = encodedText.value.length;
    decodeInputCount.textContent = decodeText.value.length;
    decodedCount.textContent = decodedText.value.length;
}

// ===== LIVE MODE =====
function updateLiveIndicator() {
    const isLive = liveMode.checked;
    liveDot.className = 'dot' + (isLive ? ' active' : '');
    liveStatus.textContent = isLive ? 'Live ON' : 'Live OFF';
    if (isLive) processAll();
}

liveMode.addEventListener('change', updateLiveIndicator);

// ===== INPUT EVENTS =====
inputText.addEventListener('input', () => {
    if (liveMode.checked) processEncode();
    updateCounts();
});

decodeText.addEventListener('input', () => {
    if (liveMode.checked) processDecode();
    updateCounts();
});

// ===== OPTIONS CHANGE =====
urlSafe.addEventListener('change', () => { if (liveMode.checked) processAll(); });
wrapLines.addEventListener('change', () => { if (liveMode.checked) processAll(); });
newlineMode.addEventListener('change', () => { if (liveMode.checked) processAll(); });

// ===== BUTTONS =====
encodeBtn.addEventListener('click', () => {
    processEncode();
    showToast('✅ Encoded!', 'success');
});

decodeBtn.addEventListener('click', () => {
    processDecode();
    showToast('✅ Decoded!', 'success');
});

swapBtn.addEventListener('click', () => {
    // Scambia i contenuti di Encode e Decode
    const temp = inputText.value;
    inputText.value = decodeText.value;
    decodeText.value = temp;
    if (liveMode.checked) processAll();
    updateCounts();
    showToast('🔄 Swapped!', 'info');
});

copyBtn.addEventListener('click', () => {
    // Copia il primo output non vuoto (Encoded o Decoded)
    const output = encodedText.value || decodedText.value;
    if (!output) {
        showToast('❌ Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showToast('📋 Copied!', 'success');
    }).catch(() => {
        if (encodedText.value) {
            encodedText.select();
            document.execCommand('copy');
        } else {
            decodedText.select();
            document.execCommand('copy');
        }
        showToast('📋 Copied!', 'success');
    });
});

clearBtn.addEventListener('click', () => {
    inputText.value = '';
    encodedText.value = '';
    decodeText.value = '';
    decodedText.value = '';
    updateCounts();
    showToast('🗑️ Cleared!', 'info');
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter = Process all
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        processAll();
        showToast('⚡ Processed!', 'success');
    }
    // Escape = Clear all
    if (e.key === 'Escape') {
        clearBtn.click();
    }
});

// ===== ANTI-DEVTOOLS =====
(function antiDevTools() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) { e.preventDefault(); return false; }
        if (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase())) { e.preventDefault(); return false; }
    });
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
})();

// ===== INIT =====
updateLiveIndicator();
updateCounts();

console.log('🔐 Base64 Encoder/Decoder loaded!');
console.log('📝 Encode top-left → Encoded top-right');
console.log('🔓 Decode bottom-left → Decoded bottom-right');
console.log('⚡ Live mode: ' + (liveMode.checked ? 'ON' : 'OFF'));
console.log('🔄 Press Ctrl+Enter to process all');
console.log('🗑️ Press Escape to clear all');