/**
 * Get works from API
 * @returns {object} allWorks - The array of works from the API
 */
export async function getAllWorks() {
    try {
        const responseAllWorks = await fetch('http://localhost:5678/api/works')
        // creates a new Error in case of statut different than 200
        if (!responseAllWorks.ok) {
            throw new Error(`Erreur statut HTTP : ${responseAllWorks.status}`);
        }
        const allWorks = await responseAllWorks.json()
        // store works in local storage to avoid other fetch
        window.localStorage.setItem('allWorks', JSON.stringify(allWorks))
        return allWorks
        
    } catch(error) {
        console.error('erreur de requête fetch :',error.message)
    }
}

/**
 * Display works in page gallery.
 */
export function displayWorks(works) {
    // Clear existing content
    document.querySelector('.gallery').innerHTML = ''
    // Loop through works and create HTML elements
    works.forEach(work => {
    const figureHtml = `<figure><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
    const modalHtml = `<figure><img class="workPicture" src="${work.imageUrl}" alt="${work.title}"><img id="${work.id}" class="deleteIcon" src="./assets/icons/delete.png"></figure>`
    document.querySelector('.gallery').innerHTML += figureHtml
    document.querySelector('.galleryModal').innerHTML += modalHtml
})
}