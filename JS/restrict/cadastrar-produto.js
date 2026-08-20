const API_URL = 'http://localhost:3000/api/produtos';

// ELEMENTOS DO HTML
const formulario = document.getElementById('formularioProduto');

const areaFormulario = document.getElementById('areaFormularioProduto');

const botaoMostrarFormulario = document.getElementById('botaoMostrarFormulario');

const botaoCancelarFormulario = document.getElementById('botaoCancelarFormulario');

const listaProdutos = document.getElementById('listaProdutos');

const pesquisaProduto = document.getElementById('pesquisaProduto');

const filtroTipo = document.getElementById('filtroTipo');

const produtosAtivos = document.getElementById('produtosAtivos');

const produtosExcluidos = document.getElementById('produtosExcluidos');

const qtdResultados = document.getElementById('qtdResultados');

const tituloProduto = document.getElementById('tituloProduto');

const tipoProduto = document.getElementById('tipoProduto');

const dataInicial = document.getElementById('dataInicial');

const dataFinal = document.getElementById('dataFinal');

const descricaoProduto = document.getElementById('descricaoProduto');

const botaoSubmit = formulario.querySelector('button[type="submit"]');


// VARIÁVEIS
// Guarda todos os relatórios recebidos do banco
let produtos = [];
// Guarda o ID do relatório que está sendo editado
// null = estamos criando um novo
let produtoEditandoId = null;

// CARREGAR RELATÓRIOS
async function carregarProdutos() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar relatórios');
        }

        produtos = await resposta.json();

        atualizarResumo();

        renderizarProdutos();

    } catch (erro) {

        console.error('Erro:', erro);

        listaProdutos.innerHTML = `
            <div class="mensagem-vazia">
                <p>Não foi possível carregar os relatórios.</p>
            </div>
        `;
    }
}

// ATUALIZAR RESUMO
function atualizarResumo() {

    const quantidadeAtivos = produtos.filter(
        produto => produto.status === 'ativo'
    ).length;

    const quantidadeExcluidos = produtos.filter(
        produto => produto.status === 'excluido'
    ).length;

    produtosAtivos.textContent = quantidadeAtivos;
    produtosExcluidos.textContent = quantidadeExcluidos;
}

// RENDERIZAR RELATÓRIOS
function renderizarProdutos() {

    const pesquisa = pesquisaProduto.value
        .trim()
        .toLowerCase();

    const tipoSelecionado = filtroTipo.value;

    // Mostra somente relatórios ativos
    let produtosFiltrados = produtos.filter(
        produto => produto.status === 'ativo'
    );

    // Pesquisa pelo título
    if (pesquisa !== '') {

        produtosFiltrados = produtosFiltrados.filter(
            produto =>
                produto.titulo
                    .toLowerCase()
                    .includes(pesquisa)
        );
    }

    // Filtro por tipo
    if (tipoSelecionado !== '') {

        produtosFiltrados = produtosFiltrados.filter(
            produto =>
                produto.tipo === tipoSelecionado
        );
    }

    // Atualiza quantidade mostrada
    qtdResultados.textContent =
        `${produtosFiltrados.length} relatório${produtosFiltrados.length !== 1 ? 's' : ''}`;

    // Nenhum resultado
    if (produtosFiltrados.length === 0) {

        listaProdutos.innerHTML = `
            <div class="mensagem-vazia">
                <p>Nenhum relatório encontrado.</p>
            </div>
        `;

        return;
    }

    // Monta os cards
    listaProdutos.innerHTML = produtosFiltrados
        .map(produto => criarCardProduto(produto))
        .join('');
}

// CRIAR CARD DO RELATÓRIO
function criarCardProduto(produto) {

    const dataInicialFormatada =
        formatarData(produto.dataInicial);

    const dataFinalFormatada =
        formatarData(produto.dataFinal);

    const tipoFormatado =
        formatarTipo(produto.tipo);

    return `
        <article class="card-produto">

            <div class="cabecalho-card-produto">

                <div>
                    <h3>${escaparHTML(produto.titulo)}</h3>

                    <span class="tipo-produto">
                        ${tipoFormatado}
                    </span>
                </div>

                <span class="status-produto">
                    Ativo
                </span>

            </div>


            <div class="informacoes-produto">

                <div class="informacao-produto">
                    <strong>Período</strong>

                    <span>
                        ${dataInicialFormatada}
                        até
                        ${dataFinalFormatada}
                    </span>
                </div>


                <div class="informacao-produto">
                    <strong>Descrição</strong>

                    <span>
                        ${escaparHTML(produto.descricao)}
                    </span>
                </div>

            </div>


            <div class="acoes-produto">

                <button
                    type="button"
                    class="botao-editar"
                    onclick="editarProduto('${produto._id}')"
                >
                    Editar
                </button>


                <button
                    type="button"
                    class="botao-excluir"
                    onclick="excluirProduto('${produto._id}')"
                >
                    Excluir
                </button>

            </div>

        </article>
    `;
}

// FORMATAR TIPO
function formatarTipo(tipo) {

    const tipos = {
        usuarios: 'Usuários',
        produtos: 'Produtos',
        vendas: 'Vendas',
        outros: 'Outros'
    };

    return tipos[tipo] || tipo;
}

// FORMATAR DATA
function formatarData(data) {

    if (!data) {
        return '-';
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return data;
    }

    return dataObj.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });
}

// PROTEGER HTML
function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return '';
    }

    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ABRIR FORMULÁRIO PARA CRIAR
function abrirFormularioCriacao() {

    produtoEditandoId = null;
    formulario.reset();
    areaFormulario.hidden = false;
    botaoSubmit.textContent = 'Criar Relatório';

    const tituloFormulario =
        areaFormulario.previousElementSibling
            ?.querySelector('h1');

    const descricaoFormulario =
        areaFormulario.previousElementSibling
            ?.querySelector('p');

    if (tituloFormulario) {
        tituloFormulario.textContent = 'Criar Relatório';
    }

    if (descricaoFormulario) {
        descricaoFormulario.textContent =
            'Preencha os dados abaixo para criar um novo relatório.';
    }

    areaFormulario.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });


    tituloProduto.focus();
}

// PREENCHER FORMULÁRIO PARA EDITAR
function preencherFormulario(produto) {

    produtoEditandoId = produto._id;

    tituloProduto.value = produto.titulo;

    tipoProduto.value = produto.tipo;

    dataInicial.value = formatarDataParaInput(produto.dataInicial);

    dataFinal.value = formatarDataParaInput(produto.dataFinal);

    descricaoProduto.value = produto.descricao;

    areaFormulario.hidden = false;

    botaoSubmit.textContent = 'Salvar Alterações';

    const tituloFormulario =
        areaFormulario.previousElementSibling
            ?.querySelector('h1');

    const descricaoFormulario =
        areaFormulario.previousElementSibling
            ?.querySelector('p');

    if (tituloFormulario) {
        tituloFormulario.textContent = 'Editar Relatório';
    }

    if (descricaoFormulario) {
        descricaoFormulario.textContent =
            'Altere os dados do relatório abaixo.';
    }

    areaFormulario.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });


    tituloProduto.focus();
}

// FORMATAR DATA PARA INPUT DATE
function formatarDataParaInput(data) {

    if (!data) {
        return '';
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return '';
    }

    const ano = dataObj.getUTCFullYear();

    const mes = String(
        dataObj.getUTCMonth() + 1
    ).padStart(2, '0');

    const dia = String(
        dataObj.getUTCDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

// EDITAR RELATÓRIO
async function editarProduto(id) {

    const produto = produtos.find(
        item => item._id === id
    );


    if (!produto) {

        alert('Relatório não encontrado.');

        return;
    }


    preencherFormulario(produto);
}

// EXCLUIR RELATÓRIO
async function excluirProduto(id) {

    const produto = produtos.find(
        item => item._id === id
    );


    if (!produto) {

        alert('Relatório não encontrado.');

        return;
    }

    const confirmou = confirm(`Deseja realmente excluir o relatório "${produto.titulo}"?`);

    if (!confirmou) {
        return;
    }

    try {

        const resposta = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao excluir relatório.');
            return;
        }

        alert('Relatório excluído com sucesso!');

        await carregarProdutos();

    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao conectar com o servidor.');
    }
}

// SALVAR / CRIAR / EDITAR
formulario.addEventListener('submit', async function (evento) {

        evento.preventDefault();

        // Validação das datas
        if (
            dataInicial.value &&
            dataFinal.value &&
            dataFinal.value < dataInicial.value
        ) {

            alert('A data final não pode ser anterior à data inicial.');

            return;
        }

        const produto = {
            titulo: tituloProduto.value.trim(),
            tipo: tipoProduto.value,
            dataInicial: dataInicial.value,
            dataFinal: dataFinal.value,
            descricao: descricaoProduto.value.trim()
        };


        try {

            let resposta;

            // EDITANDO
            if (produtoEditandoId) {
                resposta = await fetch(
                    `${API_URL}/${produtoEditandoId}`,
                    {
                        method: 'PUT',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(produto)
                    }
                );
            }

            // CRIANDO
            else {
                resposta = await fetch(
                    API_URL,
                    {
                        method: 'POST',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(produto)
                    }
                );
            }

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || 'Erro ao salvar relatório.');

                return;
            }

            if (produtoEditandoId) {
                alert('Relatório atualizado com sucesso!');

            } else {
                alert('Relatório criado com sucesso!');
            }

            // Limpa formulário
            formulario.reset();

            // Sai do modo edição
            produtoEditandoId = null;

            // Esconde formulário
            areaFormulario.hidden = true;

            // Volta botão para criação
            botaoSubmit.textContent =
                'Criar Relatório';

            // Atualiza título
            const tituloFormulario = areaFormulario.previousElementSibling?.querySelector('h1');

            const descricaoFormulario = areaFormulario.previousElementSibling?.querySelector('p');

            if (tituloFormulario) {
                tituloFormulario.textContent = 'Criar Relatório';
            }

            if (descricaoFormulario) {
                descricaoFormulario.textContent = 'Preencha os dados abaixo para criar um novo relatório.';
            }

            // Atualiza lista e contadores
            await carregarProdutos();

        } catch (erro) {
            console.error('Erro ao salvar relatório:', erro);
            alert('Erro ao conectar com o servidor.');
        }
    }
);

// CANCELAR FORMULÁRIO
botaoCancelarFormulario.addEventListener('click', function (){

        formulario.reset();
        produtoEditandoId = null;
        areaFormulario.hidden = true;
        botaoSubmit.textContent = 'Criar Relatório';


        const tituloFormulario = areaFormulario.previousElementSibling?.querySelector('h1');

        const descricaoFormulario = areaFormulario.previousElementSibling?.querySelector('p');

        if (tituloFormulario) {
            tituloFormulario.textContent = 'Criar Relatório';
        }

        if (descricaoFormulario) {
            descricaoFormulario.textContent = 'Preencha os dados abaixo para criar um novo relatório.';
        }
    }
);

// BOTÃO + CRIAR RELATÓRIO
botaoMostrarFormulario.addEventListener('click', function (){
        abrirFormularioCriacao();
    }
);

// PESQUISA
pesquisaProduto.addEventListener('input', function (){
        renderizarProdutos();
    }
);

// FILTRO POR TIPO
filtroTipo.addEventListener('change', function (){
        renderizarProdutos();
    }
);

carregarProdutos();