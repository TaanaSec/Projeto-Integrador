const adminLogado =
    JSON.parse(
        sessionStorage.getItem('adminLogado')
    );


const linkAdministradores =
    document.querySelector(
        '.link-administradores'
    );


if (
    !adminLogado ||
    adminLogado.nivel !== 'superadmin'
) {

    linkAdministradores?.remove();

}