const API_VINHOS = 'http://localhost:3000/api/produtos/vinhos';
const URL_BASE = 'http://localhost:3000';

const listaVinhos = document.getElementById('listaVinhos');
const tituloVinhos = document.getElementById('tituloVinhos');
const paginacaoVinhos = document.getElementById('paginacaoVinhos');
const buscaVinhos = document.getElementById('buscaVinhos');

let paginaAtual = 1;
let temporizadorBusca;

async function carregarVinhos(pagina = 1) {
    listaVinhos.innerHTML = '<p class="mensagem-catalogo">Carregando vinhos...</p>';

    try {
        const parametros = new URLSearchParams({ pagina: String(pagina) });
        const busca = buscaVinhos.value.trim();

        if (busca) parametros.set('busca', busca);

        const resposta = await fetch(`${API_VINHOS}?${parametros}`);
        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível carregar os vinhos.');

        paginaAtual = dados.pagina;
        atualizarTitulo(dados.total);
        renderizarVinhos(dados.produtos);
        renderizarPaginacao(dados.pagina, dados.totalPaginas);
    } catch (erro) {
        console.error(erro);
        listaVinhos.innerHTML = '<p class="mensagem-catalogo">Não foi possível carregar os vinhos. Verifique se o servidor está ligado.</p>';
        paginacaoVinhos.innerHTML = '';
    }
}

function atualizarTitulo(total) {
    const texto = total === 1 ? '1 produto' : `${total} produtos`;
    tituloVinhos.textContent = `Todos os vinhos disponíveis (${texto})`;
}

function renderizarVinhos(vinhos) {
    listaVinhos.innerHTML = '';

    if (!vinhos.length) {
        listaVinhos.innerHTML = '<p class="mensagem-catalogo">Nenhum vinho disponível no momento.</p>';
        return;
    }

    vinhos.forEach((vinho) => listaVinhos.appendChild(criarCardVinho(vinho)));
}

function criarCardVinho(vinho) {
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = `produto.html?id=${encodeURIComponent(vinho._id)}`;
    card.setAttribute('aria-label', `Ver detalhes de ${vinho.nome}`);

    const areaImagem = document.createElement('div');
    areaImagem.className = 'product-image';
    const imagem = document.createElement('img');
    imagem.src = vinho.imagem.startsWith('http') ? vinho.imagem : `${URL_BASE}${vinho.imagem}`;
    imagem.alt = vinho.nome;
    areaImagem.appendChild(imagem);

    const informacoes = document.createElement('div');
    informacoes.className = 'product-info';
    const titulo = document.createElement('h3');
    titulo.className = 'product-title';
    titulo.append(vinho.nome);

    const detalhes = [vinho.vinicola, vinho.ano].filter(Boolean).join(' · ');
    if (detalhes) {
        const meta = document.createElement('span');
        meta.className = 'product-meta';
        meta.textContent = ` — ${detalhes}`;
        titulo.appendChild(meta);
    }

    const preco = document.createElement('p');
    preco.className = 'product-price';
    preco.textContent = formatarPreco(vinho.preco);
    informacoes.append(titulo, preco);

    const botaoVisual = document.createElement('span');
    botaoVisual.className = 'btn-buy';
    botaoVisual.textContent = 'COMPRAR';

    card.append(areaImagem, informacoes, botaoVisual);
    return card;
}

function renderizarPaginacao(pagina, totalPaginas) {
    paginacaoVinhos.innerHTML = '';
    if (totalPaginas <= 1) return;

    paginacaoVinhos.appendChild(criarBotaoPagina('‹', pagina - 1, pagina === 1, 'Página anterior', 'page-arrow'));

    paginasVisiveis(pagina, totalPaginas).forEach((numero) => {
        if (numero === '…') {
            const reticencias = document.createElement('span');
            reticencias.className = 'pagina-reticencias';
            reticencias.textContent = numero;
            paginacaoVinhos.appendChild(reticencias);
            return;
        }

        const botao = criarBotaoPagina(String(numero), numero, false, `Página ${numero}`, 'page-num');
        if (numero === pagina) botao.classList.add('active');
        paginacaoVinhos.appendChild(botao);
    });

    paginacaoVinhos.appendChild(criarBotaoPagina('›', pagina + 1, pagina === totalPaginas, 'Próxima página', 'page-arrow'));
}

function criarBotaoPagina(texto, destino, desabilitado, rotulo, classe) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = classe;
    botao.textContent = texto;
    botao.disabled = desabilitado;
    botao.setAttribute('aria-label', rotulo);
    botao.addEventListener('click', () => {
        carregarVinhos(destino);
        document.querySelector('.product-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return botao;
}

function paginasVisiveis(pagina, totalPaginas) {
    if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);

    const paginas = [1];
    const inicio = Math.max(2, pagina - 1);
    const fim = Math.min(totalPaginas - 1, pagina + 1);

    if (inicio > 2) paginas.push('…');
    for (let numero = inicio; numero <= fim; numero += 1) paginas.push(numero);
    if (fim < totalPaginas - 1) paginas.push('…');
    paginas.push(totalPaginas);
    return paginas;
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

buscaVinhos.addEventListener('input', () => {
    clearTimeout(temporizadorBusca);
    temporizadorBusca = setTimeout(() => carregarVinhos(1), 300);
});

carregarVinhos();
