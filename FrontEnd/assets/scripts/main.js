console.log('main.js linké !"')

async function getAllWorks() {
    try {
        const responseAllWorks = await fetch('http://localhost:5678/api/works')
        // creates a new Error in case of statut
        if (!responseAllWorks.ok) {
            throw new Error(`Erreur statut HTTP : ${responseAllWorks.status}`);
        }

        const allWorks = await responseAllWorks.json()
        console.log(allWorks)
    } catch(error) {
        console.error('erreur de requête fetch :',error.message)
    }
    
}

getAllWorks()
