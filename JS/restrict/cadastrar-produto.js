const API_URL = 'http://localhost:3000/api/produtos';
const URL_BASE = 'http://localhost:3000';

const formulario = document.getElementById('formularioProduto');
const areaFormulario = document.getElementById('areaFormularioProduto');
const cabecalhoFormulario = document.getElementById('cabecalhoFormularioProduto');
const botaoMostrarFormulario = document.getElementById('botaoMostrarFormulario');
const botaoCancelarFormulario = document.getElementById('botaoCancelarFormulario');
const listaProdutos = document.getElementById('listaProdutos');
const pesquisaProduto = document.getElementById('pesquisaProduto');
const filtroCategoria = document.getElementById('filtroCategoria');
const produtosAtivos = document.getElementById('produtosAtivos');
const produtosExcluidos = document.getElementById('produtosExcluidos');
const qtdResultados = document.getElementById('qtdResultados');
const categoriaProduto = document.getElementById('categoriaProduto');
const camposVinho = document.getElementById('camposVinho');
const vinicolaProduto = document.getElementById('vinicolaProduto');
const anoProduto = document.getElementById('anoProduto');

let produtos = [];

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');

        produtos = await resposta.json();
        atualizarResumo();
        renderizarProdutos();
    } catch (erro) {
        console.error(erro);
        listaProdutos.innerHTML = '<div class="mensagem-vazia"><p>Não foi possível carregar os produtos.</p></div>';
    }
}

function atualizarResumo() {
    produtosAtivos.textContent = produtos.filter((produto) => (produto.status || 'ativo') === 'ativo').length;
    produtosExcluidos.textContent = produtos.filter((produto) => produto.status === 'excluido').length;
}

function renderizarProdutos() {
    const pesquisa = pesquisaProduto.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;
    const produtosFiltrados = produtos.filter((produto) => {
        const correspondePesquisa = produto.nome.toLowerCase().includes(pesquisa);
        const correspondeCategoria = !categoria || produto.categoria === categoria;
        return (produto.status || 'ativo') === 'ativo' && correspondePesquisa && correspondeCategoria;
    });

    qtdResultados.textContent = `${produtosFiltrados.length} produto${produtosFiltrados.length === 1 ? '' : 's'}`;

    if (!produtosFiltrados.length) {
        listaProdutos.innerHTML = '<div class="mensagem-vazia"><p>Nenhum produto encontrado.</p></div>';
        return;
    }

    listaProdutos.innerHTML = produtosFiltrados.map(criarCardProduto).join('');
}

function criarCardProduto(produto) {
    const imagem = produto.imagem.startsWith('http') ? produto.imagem : `${URL_BASE}${produto.imagem}`;
    const vinicola = produto.vinicola ? `<p><strong>Vinícola:</strong> ${escaparHTML(produto.vinicola)}</p>` : '';
    const ano = produto.ano ? `<p><strong>Ano:</strong> ${produto.ano}</p>` : '';

    return `
        <article class="card-produto">
            <img class="imagem-produto" src="${imagem}" alt="${escaparHTML(produto.nome)}">
            <div class="conteudo-card-produto">
                <div class="cabecalho-card-produto">
                    <div>
                        <h3>${escaparHTML(produto.nome)}</h3>
                        <span class="tipo-produto">${formatarCategoria(produto.categoria)}</span>
                    </div>
                    <span class="status-produto">Ativo</span>
                </div>
                <div class="informacoes-produto">
                    ${vinicola}
                    ${ano}
                    <p><strong>Preço:</strong> ${formatarPreco(produto.preco)}</p>
                    <p><strong>Estoque:</strong> ${produto.estoque} unidade${produto.estoque === 1 ? '' : 's'}</p>
                </div>
                <div class="acoes-produto">
                    <button type="button" class="botao-excluir" data-id="${produto._id}" data-nome="${escaparHTML(produto.nome)}">Excluir</button>
                </div>
            </div>
        </article>`;
}

function formatarCategoria(categoria) {
    return { vinho: 'Vinho', geleia: 'Geleia', suco: 'Suco', queijo: 'Queijo' }[categoria] || categoria;
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escaparHTML(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function atualizarCamposVinho() {
    const eVinho = categoriaProduto.value === 'vinho';
    camposVinho.hidden = !eVinho;
    vinicolaProduto.required = eVinho;
    anoProduto.required = eVinho;
}

function abrirFormulario() {
    formulario.reset();
    atualizarCamposVinho();
    areaFormulario.hidden = false;
    cabecalhoFormulario.hidden = false;
    areaFormulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('nomeProduto').focus();
}

function fecharFormulario() {
    formulario.reset();
    atualizarCamposVinho();
    areaFormulario.hidden = true;
    cabecalhoFormulario.hidden = true;
}

async function excluirProduto(id, nome) {
    if (!confirm(`Deseja realmente excluir o produto "${nome}"?`)) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || 'Erro ao excluir produto.');

        alert('Produto excluído com sucesso!');
        await carregarProdutos();
    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Erro ao conectar com o servidor.');
    }
}

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const resposta = await fetch(API_URL, { method: 'POST', body: new FormData(formulario) });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || 'Erro ao cadastrar produto.');

        alert('Produto cadastrado com sucesso!');
        fecharFormulario();
        await carregarProdutos();
    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Erro ao conectar com o servidor.');
    }
});

listaProdutos.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.botao-excluir');
    if (botao) excluirProduto(botao.dataset.id, botao.dataset.nome);
});

botaoMostrarFormulario.addEventListener('click', abrirFormulario);
botaoCancelarFormulario.addEventListener('click', fecharFormulario);
categoriaProduto.addEventListener('change', atualizarCamposVinho);
pesquisaProduto.addEventListener('input', renderizarProdutos);
filtroCategoria.addEventListener('change', renderizarProdutos);

atualizarCamposVinho();
carregarProdutos();
