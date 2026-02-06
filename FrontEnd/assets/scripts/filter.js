import { displayWorks} from "./utils/display.js";

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
 * Display categories in page gallery.
 */
export async function displayCategories() {
    document.querySelector('.filters').innerHTML = '<button class="filter-btn" data-id="0">Tous</button>'
    const categories = await getAllCategories()
    categories.forEach(category => {
        const categoryHtml = `<button class="filter-btn" data-id="${category.id}">${category.name}</button>`
        document.querySelector('.filters').innerHTML += categoryHtml
    })
}


export function filterWorksByCategory(id, works) {
    if(id === 0) {
        displayWorks(works)
    } else {
        const filteredWorks = works.filter(work => work.categoryId === id)
        displayWorks(filteredWorks)
    }
}

export function showSelectedFilter(id) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('selected')
    })
    document.querySelector(`.filter-btn[data-id="${id}"]`).classList.add('selected')
}