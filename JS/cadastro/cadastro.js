// cadastro/cadastro.js

async function hashSenha(senha) {
    const data = new TextEncoder().encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarNome(nome) {
    return nome.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nome);
}

function validarSenha(senha) {
    return senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha);
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

document.getElementById('formCadastro')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome           = document.getElementById('nome').value.trim();
    const email          = document.getElementById('email').value.trim();
    const senha          = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    const btn            = event.target.querySelector('button[type="submit"]');

    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarMensagem('Preencha todos os campos.');
        return;
    }

    if (!validarNome(nome)) {
        mostrarMensagem('O nome deve ter ao menos 3 letras e não pode conter números.');
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensagem('Informe um e-mail válido.');
        return;
    }

    if (!validarSenha(senha)) {
        mostrarMensagem('A senha deve ter mínimo 6 caracteres, 1 letra maiúscula e 1 número.');
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem.');
        return;
    }

    const usuarios = getUsuarios();

    if (usuarios.some(u => u.email === email)) {
        mostrarMensagem('Este e-mail já está cadastrado.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Cadastrando...';

    const senhaHash = await hashSenha(senha);
    const novoUsuario = {
        id: crypto.randomUUID(),
        nome,
        email,
        senha: senhaHash,
        criadoEm: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Já inicia a sessão sem a senha
    const { senha: _, ...dadosSeguros } = novoUsuario;
    sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosSeguros));

    mostrarMensagem('Cadastro realizado! Redirecionando...', 'sucesso');
    setTimeout(() => window.location.href = '../pages/login.html', 1500);
});