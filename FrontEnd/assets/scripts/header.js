let token = window.localStorage.getItem('token')

function setLoginLogout() {
    if(token == null) {
        document.querySelector('.loginLogout').innerHTML = '<a href="./login.html">login</a>'
    } else {
        document.querySelector('.loginLogout').innerHTML = '<a href="./index.html">logout</a>'
    }
}

setLoginLogout()


document.querySelector('.loginLogout').addEventListener('click', (event)=>{
    if(token) {
        window.localStorage.removeItem('token')
        setLoginLogout()
    }
})