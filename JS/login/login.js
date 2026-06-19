// login/login.js

async function hashSenha(senha) {
    const data = new TextEncoder().encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem');
    if (!el) return;
    el.textContent = texto;
    el.className = `mensagem ${tipo}`;
}

function getUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) ?? [];
}

// ─── Controle de tentativas ────────────────────────────────────

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS    = 30_000;

function getTentativas() {
    return JSON.parse(localStorage.getItem('loginTentativas')) ?? { count: 0, bloqueadoAte: null };
}

function salvarTentativas(dados) {
    localStorage.setItem('loginTentativas', JSON.stringify(dados));
}

function registrarFalha() {
    const dados = getTentativas();
    dados.count += 1;

    if (dados.count >= MAX_TENTATIVAS) {
        dados.bloqueadoAte = Date.now() + BLOQUEIO_MS;
        dados.count = 0;
    }

    salvarTentativas(dados);
    return dados;
}

function resetarTentativas() {
    localStorage.removeItem('loginTentativas');
}

function verificarBloqueio() {
    const { bloqueadoAte } = getTentativas();
    if (!bloqueadoAte) return false;

    if (Date.now() < bloqueadoAte) {
        const segundos = Math.ceil((bloqueadoAte - Date.now()) / 1000);
        mostrarMensagem(`Muitas tentativas. Tente novamente em ${segundos}s.`);
        return true;
    }

    resetarTentativas();
    return false;
}

// ─── Submit ───────────────────────────────────────────────────

document.getElementById('formLogin')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (verificarBloqueio()) return;

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const btn   = event.target.querySelector('button[type="submit"]');

    if (!email || !senha) {
        mostrarMensagem('Preencha todos os campos.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Entrando...';

    const usuarios  = getUsuarios();
    const senhaHash = await hashSenha(senha);

    const usuarioValido = usuarios.find(
        u => u.email === email && u.senha === senhaHash
    );

    if (usuarioValido) {
        resetarTentativas();

        const { senha: _, ...dadosSeguros } = usuarioValido;
        sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosSeguros));

        mostrarMensagem('Login realizado! Redirecionando...', 'sucesso');
        setTimeout(() => window.location.href = '../index.html', 1500);
    } else {
        const dados = registrarFalha();
        const restantes = MAX_TENTATIVAS - dados.count;

        if (restantes > 0) {
            mostrarMensagem(`E-mail ou senha incorretos. Tentativas restantes: ${restantes}.`);
        } else {
            mostrarMensagem(`Conta bloqueada por 30 segundos após várias tentativas.`);
        }

        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
});