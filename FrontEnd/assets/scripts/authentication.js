import { checkAuth } from "./utils/checkAuth.js"
import { tryAuthentication } from "./utils/requests.js"
import { displayHeader } from "./utils/display.js"

const errorMessage = document.querySelector('.errorMessage')
const form = document.querySelector('form')

// Vérification de l'état authentifié et modification du header
const token = checkAuth()
displayHeader(token)


// Ecouteur de soumission du formulaire d'authentification
form.addEventListener('submit', async (event) =>{
    event.preventDefault()
    errorMessage.innerHTML = ""
    try{
        const email = form.querySelector('[type="email').value.trim()
        if(email == "") {
            throw new Error('Vous devez saisir un email')
        }
        if(!/^[\w.-]+@[\w.-]+.[a-z]{2,}$/.test(email)) {
            throw new Error('L\'email saisi n\'a pas un format valide ')
        }
        const password = form.querySelector('[type="password"]').value.trim()
        if(password == "" || password.length<6) {
            throw new Error('Vous devez saisir un mot de passe d\'au moins 6 caractères')
        }
        const token = await tryAuthentication(email, password)
        if(token) {
            window.location.href=('index.html')
        } else {
            throw new Error('Vos informations d\'authentification sont incorrectes')
        }
    } catch(error) {
        errorMessage.innerHTML = error.message
    }
})


