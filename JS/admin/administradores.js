const API_URL =
    'http://localhost:3000/api/administradores';


const adminLogado =
    JSON.parse(
        sessionStorage.getItem('adminLogado')
    );


if (
    !adminLogado ||
    adminLogado.nivel !== 'superadmin'
) {

    window.location.href =
        '/pages/Restrito/restrict.html';

}


const token =
    sessionStorage.getItem('adminToken');


const formulario =
    document.getElementById('formularioAdmin');

const areaFormulario =
    document.getElementById('areaFormularioAdmin');

const listaAdministradores =
    document.getElementById('listaAdministradores');

const qtdAdministradores =
    document.getElementById('qtdAdministradores');

const qtdResultados =
    document.getElementById('qtdResultadosAdmin');

const botaoMostrar =
    document.getElementById('botaoMostrarFormulario');

const botaoCancelar =
    document.getElementById('botaoCancelarFormulario');

const botaoSalvar =
    document.getElementById('botaoSalvarAdmin');

const tituloFormulario =
    document.getElementById('tituloFormularioAdmin');

const descricaoFormulario =
    document.getElementById('descricaoFormularioAdmin');

const nomeAdmin =
    document.getElementById('nomeAdmin');

const emailAdmin =
    document.getElementById('emailAdmin');

const senhaAdmin =
    document.getElementById('senhaAdmin');


let administradores = [];

let administradorEditandoId = null;


// =====================================================
// CABEÇALHO DA REQUISIÇÃO
// =====================================================

function headersAdmin() {

    return {

        'Content-Type':
            'application/json',

        'Authorization':
            `Bearer ${token}`
    };

}


// =====================================================
// CARREGAR
// =====================================================

async function carregarAdministradores() {

    try {

        const resposta =
            await fetch(
                API_URL,
                {
                    method: 'GET',
                    headers: headersAdmin()
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                alert(
                    dados.erro ||
                    'Você não possui permissão para acessar esta página.'
                );

                window.location.href =
                    '/pages/Restrito/restrict.html';

                return;
            }


            throw new Error(
                dados.erro ||
                'Erro ao carregar administradores.'
            );
        }


        administradores = dados;


        atualizarResumo();

        renderizarAdministradores();

    } catch (erro) {

        console.error(erro);

        listaAdministradores.innerHTML = `
            <div class="mensagem-vazia-admin">
                <p>
                    Não foi possível carregar os administradores.
                </p>
            </div>
        `;
    }

}


// =====================================================
// RESUMO
// =====================================================

function atualizarResumo() {

    const quantidade =
        administradores.length;


    qtdAdministradores.textContent =
        quantidade;


    qtdResultados.textContent =
        `${quantidade} administrador${quantidade !== 1 ? 'es' : ''}`;
}


// =====================================================
// RENDERIZAR
// =====================================================

function renderizarAdministradores() {

    if (administradores.length === 0) {

        listaAdministradores.innerHTML = `
            <div class="mensagem-vazia-admin">
                <p>
                    Nenhum administrador cadastrado.
                </p>
            </div>
        `;

        return;
    }


    listaAdministradores.innerHTML =
        administradores
            .map(
                administrador =>
                    criarCardAdministrador(
                        administrador
                    )
            )
            .join('');
}


// =====================================================
// CARD
// =====================================================

function criarCardAdministrador(admin) {

    const data =
        admin.createdAt
            ? new Date(
                admin.createdAt
              ).toLocaleDateString('pt-BR')
            : '-';


    const principal =
        admin.nivel === 'superadmin';


    return `
        <article class="card-administrador">

            <div class="dados-administrador">

                <div class="icone-admin-card">
                    <img
                        src="/img/icone-usuarios.png"
                        alt=""
                    >
                </div>


                <div class="informacoes-admin">

                    <div class="titulo-admin-card">

                        <h3>
                            ${escaparHTML(admin.nome)}
                        </h3>

                        <span class="nivel-admin ${principal ? 'nivel-super' : ''}">
                            ${principal ? 'Superadmin' : 'Administrador'}
                        </span>

                    </div>


                    <p>
                        ${escaparHTML(admin.email)}
                    </p>


                    <span class="data-admin">
                        Cadastrado em ${data}
                    </span>

                </div>

            </div>


            <div class="acoes-admin">

                ${
                    principal
                        ? `
                            <span class="admin-principal">
                                Administrador principal
                            </span>
                        `
                        : `
                            <button
                                type="button"
                                class="botao-editar-admin"
                                onclick="editarAdministrador('${admin._id}')"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="botao-excluir-admin"
                                onclick="excluirAdministrador('${admin._id}')"
                            >
                                Excluir
                            </button>
                        `
                }

            </div>

        </article>
    `;
}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    return String(texto || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// =====================================================
// ABRIR CRIAÇÃO
// =====================================================

function abrirCriacao() {

    administradorEditandoId = null;

    formulario.reset();

    tituloFormulario.textContent =
        'Criar Administrador';

    descricaoFormulario.textContent =
        'Preencha os dados do novo administrador.';

    botaoSalvar.textContent =
        'Criar Administrador';

    senhaAdmin.required = true;

    areaFormulario.hidden = false;

    areaFormulario.scrollIntoView({
        behavior: 'smooth'
    });

    nomeAdmin.focus();
}


// =====================================================
// EDITAR
// =====================================================

function editarAdministrador(id) {

    const administrador =
        administradores.find(
            admin => admin._id === id
        );


    if (!administrador) {
        return;
    }


    if (
        administrador.nivel === 'superadmin'
    ) {

        alert(
            'O administrador principal não pode ser editado.'
        );

        return;
    }


    administradorEditandoId = id;


    nomeAdmin.value =
        administrador.nome;

    emailAdmin.value =
        administrador.email;

    senhaAdmin.value =
        '';


    tituloFormulario.textContent =
        'Editar Administrador';

    descricaoFormulario.textContent =
        'Altere os dados do administrador.';

    botaoSalvar.textContent =
        'Salvar Alterações';

    senhaAdmin.required = false;

    areaFormulario.hidden = false;


    areaFormulario.scrollIntoView({
        behavior: 'smooth'
    });

    nomeAdmin.focus();
}


// =====================================================
// SALVAR
// =====================================================

formulario.addEventListener(
    'submit',
    async function (evento) {

        evento.preventDefault();


        const dados = {

            nome:
                nomeAdmin.value.trim(),

            email:
                emailAdmin.value.trim().toLowerCase()
        };


        if (
            senhaAdmin.value.trim() !== ''
        ) {

            dados.senha =
                senhaAdmin.value;
        }


        try {

            let resposta;


            if (administradorEditandoId) {

                resposta =
                    await fetch(
                        `${API_URL}/${administradorEditandoId}`,
                        {
                            method: 'PUT',

                            headers:
                                headersAdmin(),

                            body:
                                JSON.stringify(dados)
                        }
                    );

            } else {

                resposta =
                    await fetch(
                        API_URL,
                        {
                            method: 'POST',

                            headers:
                                headersAdmin(),

                            body:
                                JSON.stringify(dados)
                        }
                    );
            }


            const retorno =
                await resposta.json();


            if (!resposta.ok) {

                alert(
                    retorno.erro ||
                    'Erro ao salvar administrador.'
                );

                return;
            }


            alert(
                retorno.mensagem
            );


            fecharFormulario();

            await carregarAdministradores();

        } catch (erro) {

            console.error(erro);

            alert(
                'Erro ao conectar com o servidor.'
            );
        }

    }
);


// =====================================================
// EXCLUIR
// =====================================================

async function excluirAdministrador(id) {

    const administrador =
        administradores.find(
            admin => admin._id === id
        );


    if (!administrador) {
        return;
    }


    const confirmou =
        confirm(
            `Deseja excluir o administrador "${administrador.nome}"?`
        );


    if (!confirmou) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: 'DELETE',
                    headers: headersAdmin()
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                'Erro ao excluir administrador.'
            );

            return;
        }


        alert(
            dados.mensagem
        );


        await carregarAdministradores();

    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao conectar com o servidor.'
        );
    }
}


// =====================================================
// FECHAR FORMULÁRIO
// =====================================================

function fecharFormulario() {

    formulario.reset();

    administradorEditandoId = null;

    areaFormulario.hidden = true;

    senhaAdmin.required = true;

    tituloFormulario.textContent =
        'Criar Administrador';

    descricaoFormulario.textContent =
        'Preencha os dados do novo administrador.';

    botaoSalvar.textContent =
        'Criar Administrador';
}


// =====================================================
// EVENTOS
// =====================================================

botaoMostrar.addEventListener(
    'click',
    abrirCriacao
);


botaoCancelar.addEventListener(
    'click',
    fecharFormulario
);


// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarAdministradores();