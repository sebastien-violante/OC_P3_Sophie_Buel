/**
 * Récupère le token d'authentification stocké en session
 * @return {string} token - le token récupéré en session
 */
export function checkAuth() {
    const token = window.sessionStorage.getItem('token')
    if(token!== null) return token
}

/**
 * Vide la session des paramètres d'authentification
 */
export function logout() {
    window.sessionStorage.removeItem('token')
    document.querySelector('.header-banner').classList.toggle('connected')
}