import { tryAuthentication } from "./utils/requests.js"

const errorMessage = document.querySelector('.errorMessage')
const form = document.querySelector('form')

// Création du token de validation
let validationToken = {
    email: '',
    isValidEmail: false,
    password: '',
    isValidPassword: false
}

// Recherche et test de données préremplies dans le formulaire
validateInput(form.querySelector('[type="email"]').value.trim(), 'email')
validateInput(form.querySelector('[type="password"]').value.trim(), 'password')

function validateInput(value, type) {
    switch(type) {
        case "password" :
            console.log(value)
            try{
                if(value === "" || value.length<6) {
                    console.log('pas bon')
                    throw new Error('Vous devez saisir un mot de passe d\'au moins 6 caractères')
                }
                validationToken.password = value
                validationToken.isValidPassword = true
                errorMessage.innerHTML = ""
            } catch(error) {
                validationToken.isValidPassword = false
                errorMessage.innerHTML = error.message
            }
            break;
        case "email" :
            try{
                if(value === "") {
                    throw new Error('Vous devez saisir un email')           
                }
                if(!/^[\w.-]+@([\w-]+\.)+[a-z]{2,}$/.test(value)) {
                    throw new Error('L\'email saisi n\'a pas un format valide ')
                }
                validationToken.email = value
                validationToken.isValidEmail = true
                errorMessage.innerHTML = ""
            } catch(error) {
                validationToken.isValidEmail = false
                errorMessage.innerHTML = error.message
            }
    }
}
// Ecouteur de changement sur le champ email
form.querySelector('[type="email"]').addEventListener('change', event => {
    errorMessage.innerHTML = ""
    validateInput(event.target.value.trim(), 'email')
})

// Ecouteur de changement sur le champ password
form.querySelector('[type="password"]').addEventListener('keyup', event => {
    console.log('je teste le pwd')
    errorMessage.innerHTML = ""
    validateInput(event.target.value.trim(), 'password')
})

// Ecouteur de soumission du formulaire d'authentification
form.addEventListener('submit', async (event) =>{
    event.preventDefault()
    if(validationToken.isValidEmail && validationToken.isValidPassword) {
        try{

            const token = await tryAuthentication(validationToken.email || form.email.value.trim(), validationToken.password || form.password.value.trim())
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




