console.log('authentication.js linké !')
const errorMessage = document.querySelector('.errorMessage')

async function tryAuthentication(email, password) {
    const tryAuthenticateResult = await fetch('http://localhost:5678/api/users/login/',
        {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email:email,password:password})
        })
    const authenticateResponse = await tryAuthenticateResult.json()
    console.log(tryAuthenticateResult.status)
    if(tryAuthenticateResult.status == "200") {
        const token = authenticateResponse.token
        console.log(token)
        return token
    }
}

const form = document.querySelector('form')
form.addEventListener('submit', (event) =>{
    event.preventDefault()
    try{
        const email = form.querySelector('[type="email').value.trim()
        if(email == "") {
            throw new Error('Vous devez saisir un email')
        }
        if(!/^[\w.-]+@[\w.-]+.[a-z]{2,}$/.test(email)) {
            throw new Error('L\'email saisi n\'a pas un format valide ')
        }
        const password = form.querySelector('[type="password').value.trim()
        if(password == "") {
            throw new Error('Vous devez saisir un mot de passe')
        }

        const token = tryAuthentication(email, password)
        if(token != null) {
            window.localStorage.setItem('token', token)
            window.location.href=('index.html')
        }

        } catch(error) {
            errorMessage.innerHTML = error.message+'<br>'
        }
    })
