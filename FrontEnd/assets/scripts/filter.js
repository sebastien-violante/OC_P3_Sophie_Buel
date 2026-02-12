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

        // Creates a set instance to avoid redundant values
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
 * Filters the works according to a category id
 * @param {number} id - the category id to display
 * @param {object} works - the whole works coming from the API
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
 * Underlignes the filter button corresponding to the chosen category
 * @param {number} id - the id of the category to display
 */
export function showSelectedFilter(id) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('selected')
    })
    document.querySelector(`.filter-btn[data-id="${id}"]`).classList.add('selected')
}