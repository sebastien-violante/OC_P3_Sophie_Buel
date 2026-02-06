import { filterWorksByCategory, showSelectedFilter } from '../filter.js'
import { displayModal } from '../modal.js'

/**
 * Display works in page gallery.
 */
export function displayWorks(works) {
    // Clear existing content
    document.querySelector('.gallery').innerHTML = ''
    // Loop through works and create HTML elements
    works.forEach(work => {
        const figureHtml = `<figure data-id='${work.id}'><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
        const modalHtml = `<figure data-id='${work.id}'><img class="workPicture" src="${work.imageUrl}" alt="${work.title}"><img id="${work.id}" class="deleteIcon" src="./assets/icons/delete.png"></figure>`
        document.querySelector('.gallery').innerHTML += figureHtml
        document.querySelector('.galleryModal').innerHTML += modalHtml
    })
}

export function displayNewWork(work) {
    // Ajout de la nouvelle figure dans la modale
    const newModalFigure = document.createElement('figure')
    newModalFigure.setAttribute('data-id', work.id)
    newModalFigure.innerHTML = `<img class="workPicture" src="${work.url}" alt="${work.title}"><img id="${work.id}" class="deleteIcon" src="./assets/icons/delete.png">`
    document.querySelector('.galleryModal').appendChild(newModalFigure)
    // Ajout de la nouvelle figure dans la galerie
    const newGalleryFigure = document.createElement('figure')
    newGalleryFigure.setAttribute('data-id', work.id)
    newGalleryFigure.innerHTML = `<img src="${work.url}" alt="${work.title}"><figcaption>${work.title}</figcaption>`
    document.querySelector('.gallery').appendChild(newGalleryFigure)
}

/**
 * Display categories in page gallery.
 */
export async function displayCategories(allCategories) {
    if(allCategories) {
       document.querySelector('.filters').innerHTML = '<button class="filter-btn" data-id="0">Tous</button>'
        allCategories.forEach(category => {
        const categoryHtml = `<button class="filter-btn" data-id="${category.id}">${category.name}</button>`
        document.querySelector('.filters').innerHTML += categoryHtml
    }) 
    } else {
       document.querySelector('.filters').innerHTML = ""
    } 
}

export function displayIndexPage(token, allCategories, allWorks) {
    if(token) {
        // Ajout du titre portfolio
        document.querySelector('#portfolio .title').innerHTML = '<h2>Mes projets</h2><div class="enableModify"><img class="enableModifyIcon" src="./assets/icons/modify.png"><p>modifier</p></div>'
        // Suppression des boutons de filtre 
        displayCategories()
        displayModal(allCategories, token)
    } else {
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

export function displayHeader(token) {
    if(token) {
        const loginLogout = document.querySelector('nav ul li.loginLogout')
        loginLogout.innerHTML = "<a href='index.html'>Logout</a>"
        loginLogout.addEventListener('click', () => {
            window.sessionStorage.removeItem('token')
            window.sessionStorage.removeItem('userId')
            window.location.href=('index.html')
        })
    }
    else {
        document.querySelector('nav ul li.loginLogout').innerHTML="<a href='login.html'>Login</a>" 
    }
}