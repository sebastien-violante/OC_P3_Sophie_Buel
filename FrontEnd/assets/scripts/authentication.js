import { checkAuth } from "./utils/checkAuth.js"
import { tryAuthentication } from "./utils/requests.js"
import { displayHeader } from "./utils/display.js"

const errorMessage = document.querySelector('.errorMessage')
const form = document.querySelector('form')

// Vérification de l'état authentifié et modification du header
const token = checkAuth()
displayHeader(token)

// Création du token de validation
let validationToken = {
    email: null,
    password: null
}
// Ecouteur de changement sur le champ email
form.querySelector('[type="email"]').addEventListener('change', event => {
    errorMessage.innerHTML = ""
    try{
        const email = event.target.value.trim()
        if(email == "") {
            throw new Error('Vous devez saisir un email')           
        }
        if(!/^[\w.-]+@([\w-]+\.)+[a-z]{2,}$/.test(email)) {
            console.log('faux')
            throw new Error('L\'email saisi n\'a pas un format valide ')
        }
        validationToken.email = email
        errorMessage.innerHTML = ""
    } catch(error) {
      errorMessage.innerHTML = error.message
    }
})

// Ecouteur de changement sur le champ password
form.querySelector('[type="password"]').addEventListener('change', event => {
    errorMessage.innerHTML = ""
    try{
        const password = form.querySelector('[type="password"]').value.trim()
        if(password === "" || password.length<6) {
            throw new Error('Vous devez saisir un mot de passe d\'au moins 6 caractères')
        }
        validationToken.password = password
        errorMessage.innerHTML = ""
    } catch(error) {
      errorMessage.innerHTML = error.message
    }
})

// Ecouteur de soumission du formulaire d'authentification
form.addEventListener('submit', async (event) =>{
    event.preventDefault()
    console.log(validationToken)
    if(validationToken.email != null && validationToken.password != null) {
        try{

            const token = await tryAuthentication(validationToken.email, validationToken.password)
            if(token) {
                window.location.href=('index.html')
            } else {
                throw new Error('Vos informations d\'authentification sont incorrectes')
            }
        } catch(error) {
            errorMessage.innerHTML = error.message
        }
    }   
})


