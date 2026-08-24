const adminToken = sessionStorage.getItem('adminToken');

if (!adminToken) {
    window.location.href = '/pages/admin-login.html';
}