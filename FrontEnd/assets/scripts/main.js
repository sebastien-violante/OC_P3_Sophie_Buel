console.log('main.js chargé')

// Import des méthodes
import { getData } from './utils/requests.js'
import { filterWorksByCategory } from './filter.js'
import { checkAuth } from './utils/checkAuth.js'
import { displayIndexPage, displayHeader } from './utils/display.js'

// Import des data
const allCategories = await getData('categories')
const allWorks = await getData('works')

// Affichage des travaux
filterWorksByCategory(0, allWorks)
// Vérification de la connexion
const token = checkAuth()

// Affichage de la page et du header correspondant au statut connecté ou non connecté
displayIndexPage(token, allCategories, allWorks)
displayHeader(token)


