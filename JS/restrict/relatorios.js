const API_URL = 'http://localhost:3000/api/relatorios';

// ELEMENTOS DO HTML
const formulario = document.getElementById('formularioRelatorio');

const areaFormulario = document.getElementById('areaFormularioRelatorio');

const botaoMostrarFormulario = document.getElementById('botaoMostrarFormulario');

const botaoCancelarFormulario = document.getElementById('botaoCancelarFormulario');

const listaRelatorios = document.getElementById('listaRelatorios');

const pesquisaRelatorio = document.getElementById('pesquisaRelatorio');

const filtroTipo = document.getElementById('filtroTipo');

const relatoriosAtivos = document.getElementById('relatoriosAtivos');

const relatoriosExcluidos = document.getElementById('relatoriosExcluidos');

const qtdResultados = document.getElementById('qtdResultados');

const tituloRelatorio = document.getElementById('tituloRelatorio');

const tipoRelatorio = document.getElementById('tipoRelatorio');

const dataInicial = document.getElementById('dataInicial');

const dataFinal = document.getElementById('dataFinal');

const descricaoRelatorio = document.getElementById('descricaoRelatorio');

const botaoSubmit = formulario.querySelector('button[type="submit"]');


// VARIÁVEIS
// Guarda todos os relatórios recebidos do banco
let relatorios = [];
// Guarda o ID do relatório que está sendo editado
// null = estamos criando um novo
let relatorioEditandoId = null;

// CARREGAR RELATÓRIOS
async function carregarRelatorios() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar relatórios');
        }

        relatorios = await resposta.json();

        atualizarResumo();

        renderizarRelatorios();

    } catch (erro) {

        console.error('Erro:', erro);

        listaRelatorios.innerHTML = `
            <div class="mensagem-vazia">
                <p>Não foi possível carregar os relatórios.</p>
            </div>
        `;
    }
}

// ATUALIZAR RESUMO
function atualizarResumo() {

    const quantidadeAtivos = relatorios.filter(
        relatorio => relatorio.status === 'ativo'
    ).length;

    const quantidadeExcluidos = relatorios.filter(
        relatorio => relatorio.status === 'excluido'
    ).length;

    relatoriosAtivos.textContent = quantidadeAtivos;
    relatoriosExcluidos.textContent = quantidadeExcluidos;
}

// RENDERIZAR RELATÓRIOS
function renderizarRelatorios() {

    const pesquisa = pesquisaRelatorio.value
        .trim()
        .toLowerCase();

    const tipoSelecionado = filtroTipo.value;

    // Mostra somente relatórios ativos
    let relatoriosFiltrados = relatorios.filter(
        relatorio => relatorio.status === 'ativo'
    );

    // Pesquisa pelo título
    if (pesquisa !== '') {

        relatoriosFiltrados = relatoriosFiltrados.filter(
            relatorio =>
                relatorio.titulo
                    .toLowerCase()
                    .includes(pesquisa)
        );
    }

    // Filtro por tipo
    if (tipoSelecionado !== '') {

        relatoriosFiltrados = relatoriosFiltrados.filter(
            relatorio =>
                relatorio.tipo === tipoSelecionado
        );
    }

    // Atualiza quantidade mostrada
    qtdResultados.textContent =
        `${relatoriosFiltrados.length} relatório${relatoriosFiltrados.length !== 1 ? 's' : ''}`;

    // Nenhum resultado
    if (relatoriosFiltrados.length === 0) {

        listaRelatorios.innerHTML = `
            <div class="mensagem-vazia">
                <p>Nenhum relatório encontrado.</p>
            </div>
        `;

        return;
    }

    // Monta os cards
    listaRelatorios.innerHTML = relatoriosFiltrados
        .map(relatorio => criarCardRelatorio(relatorio))
        .join('');
}

// CRIAR CARD DO RELATÓRIO
function criarCardRelatorio(relatorio) {

    const dataInicialFormatada =
        formatarData(relatorio.dataInicial);

    const dataFinalFormatada =
        formatarData(relatorio.dataFinal);

    const tipoFormatado =
        formatarTipo(relatorio.tipo);

    return `
        <article class="card-relatorio">

            <div class="cabecalho-card-relatorio">

                <div>
                    <h3>${escaparHTML(relatorio.titulo)}</h3>

                    <span class="tipo-relatorio">
                        ${tipoFormatado}
                    </span>
                </div>

                <span class="status-relatorio">
                    Ativo
                </span>

            </div>


            <div class="informacoes-relatorio">

                <div class="informacao-relatorio">
                    <strong>Período</strong>

                    <span>
                        ${dataInicialFormatada}
                        até
                        ${dataFinalFormatada}
                    </span>
                </div>


                <div class="informacao-relatorio">
                    <strong>Descrição</strong>

                    <span>
                        ${escaparHTML(relatorio.descricao)}
                    </span>
                </div>

            </div>


            <div class="acoes-relatorio">

                <button
                    type="button"
                    class="botao-editar"
                    onclick="editarRelatorio('${relatorio._id}')"
                >
                    Editar
                </button>


                <button
                    type="button"
                    class="botao-excluir"
                    onclick="excluirRelatorio('${relatorio._id}')"
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

    relatorioEditandoId = null;
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


    tituloRelatorio.focus();
}

// PREENCHER FORMULÁRIO PARA EDITAR
function preencherFormulario(relatorio) {

    relatorioEditandoId = relatorio._id;

    tituloRelatorio.value = relatorio.titulo;

    tipoRelatorio.value = relatorio.tipo;

    dataInicial.value = formatarDataParaInput(relatorio.dataInicial);

    dataFinal.value = formatarDataParaInput(relatorio.dataFinal);

    descricaoRelatorio.value = relatorio.descricao;

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


    tituloRelatorio.focus();
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
async function editarRelatorio(id) {

    const relatorio = relatorios.find(
        item => item._id === id
    );


    if (!relatorio) {

        alert('Relatório não encontrado.');

        return;
    }


    preencherFormulario(relatorio);
}

// EXCLUIR RELATÓRIO
async function excluirRelatorio(id) {

    const relatorio = relatorios.find(
        item => item._id === id
    );


    if (!relatorio) {

        alert('Relatório não encontrado.');

        return;
    }

    const confirmou = confirm(`Deseja realmente excluir o relatório "${relatorio.titulo}"?`);

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

        await carregarRelatorios();

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

        const relatorio = {
            titulo: tituloRelatorio.value.trim(),
            tipo: tipoRelatorio.value,
            dataInicial: dataInicial.value,
            dataFinal: dataFinal.value,
            descricao: descricaoRelatorio.value.trim()
        };


        try {

            let resposta;

            // EDITANDO
            if (relatorioEditandoId) {
                resposta = await fetch(
                    `${API_URL}/${relatorioEditandoId}`,
                    {
                        method: 'PUT',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(relatorio)
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
                        body: JSON.stringify(relatorio)
                    }
                );
            }

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || 'Erro ao salvar relatório.');

                return;
            }

            if (relatorioEditandoId) {
                alert('Relatório atualizado com sucesso!');

            } else {
                alert('Relatório criado com sucesso!');
            }

            // Limpa formulário
            formulario.reset();

            // Sai do modo edição
            relatorioEditandoId = null;

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
            await carregarRelatorios();

        } catch (erro) {
            console.error('Erro ao salvar relatório:', erro);
            alert('Erro ao conectar com o servidor.');
        }
    }
);

// CANCELAR FORMULÁRIO
botaoCancelarFormulario.addEventListener('click', function (){

        formulario.reset();
        relatorioEditandoId = null;
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
pesquisaRelatorio.addEventListener('input', function (){
        renderizarRelatorios();
    }
);

// FILTRO POR TIPO
filtroTipo.addEventListener('change', function (){
        renderizarRelatorios();
    }
);

carregarRelatorios();