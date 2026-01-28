console.log('main.js linké !"')

/**
 * Get works from API
 * @returns {object} allWorks - The array of works from the API
 */
async function getAllWorks() {
    try {
        const responseAllWorks = await fetch('http://localhost:5678/api/works')
        // creates a new Error in case of statut different than 200
        if (!responseAllWorks.ok) {
            throw new Error(`Erreur statut HTTP : ${responseAllWorks.status}`);
        }
        allWorks = await responseAllWorks.json()
        return allWorks
    } catch(error) {
        console.error('erreur de requête fetch :',error.message)
    }
    
}

/**
 * Display works in page gallery.
 */
async function displayWorks() {
    // Clear existing content
    document.querySelector('.gallery').innerHTML = ''
    // Fetch works from API
    const works  = await getAllWorks()
    // Loop through works and create HTML elements
    works.forEach(work => {
    const figureHtml = `<figure><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
    document.querySelector('.gallery').innerHTML += figureHtml
})
}

displayWorks()


