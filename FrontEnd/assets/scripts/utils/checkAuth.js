export function checkAuth() {
    const token = window.sessionStorage.getItem('token')
    if(token!== null) return token
}

export function logout() {
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('userId')
}