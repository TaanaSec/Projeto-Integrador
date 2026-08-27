const API_PRODUTOS = 'http://localhost:3000/api/produtos';
const URL_SERVIDOR = 'http://localhost:3000';
const CHAVE_CARRINHO = 'carrinhoLaTavola';
const detalheProduto = document.getElementById('produtoDetalhe');
const idProduto = new URLSearchParams(window.location.search).get('id');

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

function exigirLogin(destino) {
    if (sessionStorage.getItem('token') && sessionStorage.getItem('usuarioLogado')) return true;
    window.location.href = `login.html?redirect=${encodeURIComponent(destino)}`;
    return false;
}

function enderecoImagem(imagem) {
    return imagem?.startsWith('http') ? imagem : `${URL_SERVIDOR}${imagem}`;
}

function renderizarProduto(produto) {
    document.title = `${produto.nome} - La Tavola`;
    detalheProduto.className = 'produto-detalhe';
    detalheProduto.innerHTML = `
        <div class="breadcrumb-produto"><a href="../index.html">Início</a> / <a href="vinhos.html">Vinhos</a> / ${produto.nome}</div>
        <section class="produto-card">
          <div class="produto-imagem-principal"><img src="${enderecoImagem(produto.imagem)}" alt="${produto.nome}"></div>
          <div class="produto-informacoes">
            <span class="produto-categoria">Vinho selecionado</span>
            <h1 class="produto-titulo">${produto.nome}</h1>
            <p class="produto-meta">${produto.vinicola} · Safra ${produto.ano}</p>
            <p class="produto-preco">${formatarPreco(produto.preco)}</p>
            <p class="produto-descricao">Um vinho cuidadosamente selecionado pela La Tavola para tornar seus momentos à mesa ainda mais especiais. Aproveite seus aromas, sabores e a versatilidade de uma boa harmonização.</p>
            <dl class="produto-ficha"><dt>Vinícola</dt><dd>${produto.vinicola}</dd><dt>Safra</dt><dd>${produto.ano}</dd><dt>Disponibilidade</dt><dd>${produto.estoque} unidade${produto.estoque === 1 ? '' : 's'} em estoque</dd></dl>
            <div class="area-compra">
              <div class="controle-quantidade" aria-label="Escolha a quantidade">
                <button id="diminuirQuantidade" type="button" aria-label="Diminuir quantidade">−</button>
                <output id="quantidadeProduto" aria-live="polite">1</output>
                <button id="aumentarQuantidade" type="button" aria-label="Aumentar quantidade">+</button>
              </div>
              <button id="adicionarCarrinho" class="btn-adicionar" type="button">ADICIONAR AO CARRINHO</button>
            </div>
            <p class="produto-aviso">Você precisa estar logado para adicionar produtos ao carrinho.</p>
          </div>
        </section>`;

    let quantidade = 1;
    const visorQuantidade = document.getElementById('quantidadeProduto');
    const atualizarQuantidade = () => { visorQuantidade.value = quantidade; visorQuantidade.textContent = quantidade; };

    document.getElementById('diminuirQuantidade').addEventListener('click', () => {
        quantidade = Math.max(1, quantidade - 1);
        atualizarQuantidade();
    });
    document.getElementById('aumentarQuantidade').addEventListener('click', () => {
        quantidade = Math.min(produto.estoque, quantidade + 1);
        atualizarQuantidade();
    });
    document.getElementById('adicionarCarrinho').addEventListener('click', () => {
        const destino = `produto.html?id=${encodeURIComponent(produto._id)}`;
        if (!exigirLogin(destino)) return;

        const carrinho = obterCarrinho();
        const itemExistente = carrinho.find((item) => item.id === produto._id);
        if (itemExistente) {
            itemExistente.quantidade = Math.min(produto.estoque, itemExistente.quantidade + quantidade);
        } else {
            carrinho.push({
                id: produto._id,
                nome: produto.nome,
                vinicola: produto.vinicola,
                ano: produto.ano,
                preco: Number(produto.preco),
                imagem: produto.imagem,
                estoque: produto.estoque,
                quantidade
            });
        }
        salvarCarrinho(carrinho);
        window.location.href = 'carrinho.html';
    });
}

async function carregarProduto() {
    if (!idProduto) {
        detalheProduto.className = 'estado-produto produto-erro';
        detalheProduto.innerHTML = 'Produto não informado. <a href="vinhos.html">Voltar para os vinhos</a>';
        return;
    }
    try {
        const resposta = await fetch(`${API_PRODUTOS}/${encodeURIComponent(idProduto)}`);
        const produto = await resposta.json();
        if (!resposta.ok) throw new Error(produto.erro || 'Não foi possível carregar o produto.');
        renderizarProduto(produto);
    } catch (erro) {
        console.error(erro);
        detalheProduto.className = 'estado-produto produto-erro';
        detalheProduto.innerHTML = `${erro.message} <a href="vinhos.html">Voltar para os vinhos</a>`;
    }
}

carregarProduto();
