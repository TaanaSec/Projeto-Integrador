const CHAVE_CARRINHO = 'carrinhoLaTavola';
const URL_SERVIDOR = 'http://localhost:3000';
const itensCarrinho = document.getElementById('itensCarrinho');
const subtotalCarrinho = document.getElementById('subtotalCarrinho');
const totalCarrinho = document.getElementById('totalCarrinho');

function exigirLogin() {
    if (sessionStorage.getItem('token') && sessionStorage.getItem('usuarioLogado')) return true;
    window.location.href = 'login.html?redirect=carrinho.html';
    return false;
}

function obterCarrinho() {
    try {
        const carrinho = JSON.parse(sessionStorage.getItem(CHAVE_CARRINHO));
        return Array.isArray(carrinho) ? carrinho : [];
    } catch {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    sessionStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function enderecoImagem(imagem) {
    return imagem?.startsWith('http') ? imagem : `${URL_SERVIDOR}${imagem}`;
}

function atualizarResumo(carrinho) {
    const subtotal = carrinho.reduce((total, item) => total + (Number(item.preco) * item.quantidade), 0);
    subtotalCarrinho.textContent = formatarPreco(subtotal);
    totalCarrinho.textContent = formatarPreco(subtotal);
}

function alterarQuantidade(id, alteracao) {
    const carrinho = obterCarrinho();
    const item = carrinho.find((produto) => produto.id === id);
    if (!item) return;
    item.quantidade = Math.max(1, Math.min(Number(item.estoque) || 1, item.quantidade + alteracao));
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function removerItem(id) {
    salvarCarrinho(obterCarrinho().filter((item) => item.id !== id));
    renderizarCarrinho();
}

function criarItem(item) {
    const artigo = document.createElement('article');
    artigo.className = 'item-carrinho';

    const imagemArea = document.createElement('div');
    imagemArea.className = 'imagem-item';
    const imagem = document.createElement('img');
    imagem.src = enderecoImagem(item.imagem);
    imagem.alt = item.nome;
    imagemArea.appendChild(imagem);

    const informacoes = document.createElement('div');
    const nome = document.createElement('h2');
    nome.className = 'item-nome';
    nome.textContent = item.nome;
    const meta = document.createElement('p');
    meta.className = 'item-meta';
    meta.textContent = `${item.vinicola} · Safra ${item.ano}`;
    const preco = document.createElement('span');
    preco.className = 'item-preco';
    preco.textContent = formatarPreco(item.preco);
    informacoes.append(nome, meta, preco);

    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';
    const controle = document.createElement('div');
    controle.className = 'controle-quantidade';
    const diminuir = document.createElement('button');
    diminuir.type = 'button';
    diminuir.textContent = '−';
    diminuir.setAttribute('aria-label', `Diminuir quantidade de ${item.nome}`);
    diminuir.addEventListener('click', () => alterarQuantidade(item.id, -1));
    const quantidade = document.createElement('span');
    quantidade.textContent = item.quantidade;
    quantidade.setAttribute('aria-label', `${item.quantidade} unidade${item.quantidade === 1 ? '' : 's'}`);
    const aumentar = document.createElement('button');
    aumentar.type = 'button';
    aumentar.textContent = '+';
    aumentar.setAttribute('aria-label', `Aumentar quantidade de ${item.nome}`);
    aumentar.disabled = item.quantidade >= (Number(item.estoque) || 1);
    aumentar.addEventListener('click', () => alterarQuantidade(item.id, 1));
    controle.append(diminuir, quantidade, aumentar);

    const remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'remover-item';
    remover.textContent = 'REMOVER';
    remover.addEventListener('click', () => removerItem(item.id));
    acoes.append(controle, remover);
    artigo.append(imagemArea, informacoes, acoes);
    return artigo;
}

function renderizarCarrinho() {
    const carrinho = obterCarrinho();
    itensCarrinho.innerHTML = '';
    atualizarResumo(carrinho);
    if (!carrinho.length) {
        itensCarrinho.innerHTML = '<div class="carrinho-vazio"><h2>Seu carrinho está vazio</h2><p>Escolha seus vinhos preferidos para começar uma compra.</p><a href="vinhos.html">VER VINHOS</a></div>';
        return;
    }
    carrinho.forEach((item) => itensCarrinho.appendChild(criarItem(item)));
}

if (exigirLogin()) renderizarCarrinho();
