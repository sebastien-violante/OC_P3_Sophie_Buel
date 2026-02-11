import { displayWorksInHomepage } from "./utils/display.js";

/**
 * Get categories from API
 * @returns {object} allCategories - The array of categories from the API
 */
export async function getAllCategories() {
    try {
        const responseAllCategories = await fetch('http://localhost:5678/api/categories')
        // Creates a new Error in case of statut different than 200
        if (!responseAllCategories.ok) {
            throw new Error(`Erreur statut HTTP : ${responseAllCategories.status}`);
        }
        const allCategories = await responseAllCategories.json()

        // Create a set instance to avoid redundant values
        const setAllCategories = new Set
        allCategories.forEach(category => { 
            setAllCategories.add(category)
        })

        return setAllCategories

    } catch(error) {
        console.error('erreur de requête fetch :',error.message)
    }
}

/**
 * Récupère les catégories à l'aide de l'API et les affiche
 * @param {number} id - l'id de la catégorie à afficher
 * @param {object} works - l'ensemble des travaux avant filtrage
 
export function displayCategories() {
    // Crée un bouton par défaut permettant avec l'id = 0 d'afficher tous les travaux sans filtrage
    document.querySelector('.filters').innerHTML = '<button class="filter-btn" data-id="0">Tous</button>'
    const categories = getAllCategories()
    categories.forEach(category => {
        const categoryHtml = `<button class="filter-btn" data-id="${category.id}">${category.name}</button>`
        document.querySelector('.filters').innerHTML += categoryHtml
    })
}
*/
/**
 * Filtre les travaux en fonction de l'id d'une catégorie et appelle leur affichage
 * @param {number} id - l'id de la catégorie à afficher
 * @param {object} works - l'ensemble des travaux avant filtrage
 */
export function filterWorksByCategory(id, works) {
    if(id === 0) {
        displayWorksInHomepage(works)
    } else {
        const filteredWorks = works.filter(work => work.categoryId === id)
        displayWorksInHomepage(filteredWorks)
    }
}

/**
 * Met en évidence le bouton correspondant au filtre appliqué
 * @param {number} id - l'id de la catégorie à afficher
 */
export function showSelectedFilter(id) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('selected')
    })
    document.querySelector(`.filter-btn[data-id="${id}"]`).classList.add('selected')
}