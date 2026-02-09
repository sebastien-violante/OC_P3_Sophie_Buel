import { filterWorksByCategory, showSelectedFilter } from '../filter.js'
import { displayModal } from '../modal.js'
import { logout } from './checkAuth.js'

/**
 * Affiche les travaux dans la gallerie et dans la modale
 * @param {object} works - les travaux récupérés depuis l'API
 */
export function displayWorks(works) {
    // Initialisation du contenu de la gallerie
    document.querySelector('.gallery').innerHTML = ''
    // Bouclage sur les travaux pour créer les éléments
    works.forEach(work => {
        const figureHtml = `<figure data-id='${work.id}'><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
        const modalHtml = `<figure data-id='${work.id}'><img class="workPicture" src="${work.imageUrl}" alt="${work.title}"><a href="#" id="${work.id}" class="deleteIcon"><img src="./assets/icons/delete.png"></a></figure>`
        document.querySelector('.gallery').innerHTML += figureHtml
        document.querySelector('.galleryModal').innerHTML += modalHtml
    })
}

/**
 * Affiche un nouveau travail dans la gallerie et dans la modale
 * @param {object} work - le nouveau travail issu du formulaire
 */
export function displayNewWork(work) {
    // Ajout de la nouvelle <figure> dans la modale
    const newModalFigure = document.createElement('figure')
    newModalFigure.setAttribute('data-id', work.id)
    newModalFigure.innerHTML = `<img class="workPicture" src="${work.url}" alt="${work.title}"><a href="#" id="${work.id}" class="deleteIcon"><img src="./assets/icons/delete.png"></a>`
    document.querySelector('.galleryModal').appendChild(newModalFigure)
    // Ajout de la nouvelle <figure> dans la galerie
    const newGalleryFigure = document.createElement('figure')
    newGalleryFigure.setAttribute('data-id', work.id)
    newGalleryFigure.innerHTML = `<img src="${work.url}" alt="${work.title}"><figcaption>${work.title}</figcaption>`
    document.querySelector('.gallery').appendChild(newGalleryFigure)
}

/**
 * Affiche les catégories dans la gallerie sous forme de boutons de filtre
 * @param {object} allCategories - les catégories récupérées depuis l'API
 */
export async function displayCategories(allCategories) {
    if(allCategories) {
        // Bouclage sur l'objet pour afficher les boutons de filtre
        document.querySelector('.filters').innerHTML = '<button class="filter-btn" data-id="0">Tous</button>'
        allCategories.forEach(category => {
        const categoryHtml = `<button class="filter-btn" data-id="${category.id}">${category.name}</button>`
        document.querySelector('.filters').innerHTML += categoryHtml
    }) 
    } else {
        // Cas où l'utilisateur est connecté en tant qu'administrateur. Les filtres ne sont pas accessibles
        document.querySelector('.filters').innerHTML = ""
    } 
}

/**
 * Affiche la page index en fonction du profil utilisateur (connecté ou non)
 * @param {string} token - le token transmis par l'API
 * @param {object} allCategories - les catégories récupérées depuis l'API
 * @param {object} allWorks - les travaux récupérés depuis l'API
*/
export function displayIndexPage(token, allCategories, allWorks) {
    // Cas d'un utilisateur connecté avec un token
    if(token) {
        // Ajout du titre portfolio
        document.querySelector('#portfolio .title').innerHTML = '<h2>Mes projets</h2><a href="#" class="enableModify"><img class="enableModifyIcon" src="./assets/icons/modify.png"><p>modifier</p></a>'
        // Suppression des boutons de filtre 
        displayCategories()
        displayModal(allCategories, token)
    } 
    // Cas d'un utilisateur non connecté
    else 
        {
        // Ajout du titre portfolio
        document.querySelector('#portfolio .title').innerHTML="<h2>Mes Projets</h2>"
        // Ajout des boutons de filtre et affichage du bouton sélectionné
        displayCategories(allCategories)
        document.querySelector('.filters .filter-btn[data-id="0"]').classList.add('selected')
        // Ecoute des sélections des boutons de filtres   
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                filterWorksByCategory(Number(event.target.dataset.id), allWorks)
                showSelectedFilter(Number(event.target.dataset.id))
            })
        })
    }
}

/**
 * Affiche un header différent en fonction du profil utilisateur (connecté ou non)
 * @param {string} token - le token transmis par l'API
*/
export function displayHeader(token) {
    // Cas de l'utilisateur connecté
    if(token) {
        const loginLogout = document.querySelector('nav ul li.loginLogout')
        loginLogout.innerHTML = "<a href='index.html'>Logout</a>"
        loginLogout.addEventListener('click', () => {
            // Déconnexion et redirection
            logout()
            window.location.href=('index.html')
        })
    }
    // Cas de l'utilisateur non connecté
    else 
    {
        document.querySelector('nav ul li.loginLogout').innerHTML="<a href='login.html'>Login</a>" 
    }
}