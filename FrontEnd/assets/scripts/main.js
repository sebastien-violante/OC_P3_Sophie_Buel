// Import des méthodes
import { getData } from './utils/requests.js'
import { filterWorksByCategory } from './filter.js'
import { checkAuth } from './utils/checkAuth.js'
import { displayIndexPage, displayHeader } from './utils/display.js'

// Import des data depuis l'API
const allBrutCategories = await getData('categories')
const allWorks = await getData('works')

// Elimination des doublons possibles de catégories et ajout de la catégorie 0 = "tous"
const allCategories = new Set
allCategories.add({id: 0, name: 'Tous'})
allBrutCategories.forEach(category => { 
    allCategories.add(category)
})

// Vérification de la connexion
const token = checkAuth()

// Affichage de la page et du header correspondant au statut connecté ou non connecté
displayIndexPage(token, allCategories, allWorks)
displayHeader(token)

// Affichage des travaux par catégorie
filterWorksByCategory(0, allWorks)