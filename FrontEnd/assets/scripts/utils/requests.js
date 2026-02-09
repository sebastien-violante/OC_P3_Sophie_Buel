/**
 * Récupère un type de données depuis l'API
 * @param {string} type - le type de données à récupérer : works ou categories
 * @return {response} allData - les données récupérées en provenance de l'API
 */
export async function getData(type) {
    try {
        const requestResponse = await fetch(`http://localhost:5678/api/${type}`)
        if(!requestResponse.ok) {
            throw new Error(`Erreur HTTP : ${requestResponse.status}`)
        }
        const allData = await requestResponse.json()
        return allData
    } catch(error) {
        console.error(error.message)
    }  
}

/**
 * Envoie les données d'authentifications récupérées depuis le formulaire de connexion et renvoie le token si les informations sont valides
 * @param {string} email - l'email saisi dans le formulaire d'authentification
 * @param {string} password - le mot de passe saisi dans le formulaire d'authentification
 * @return {string} token - le token d'authentification
 */
export async function tryAuthentication(email, password) {
    const tryAuthenticateResult = await fetch('http://localhost:5678/api/users/login/',
        {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email:email,password:password})
        })
    if(tryAuthenticateResult.status === 200) {   
        const authenticateResponse = await tryAuthenticateResult.json()
        window.sessionStorage.setItem('token', authenticateResponse.token)
        //window.sessionStorage.setItem('userId', authenticateResponse.userId)
        
        return  authenticateResponse.token
    }
}

/**
 * Supprime un travail dans la base de données par une requête à l'API
 * @param {number} idWork - l'id du travail à supprimer
 * @param {string} token - le token d'authentification
 * @return {number} requestResult.status - le status de la requête renvoyée par l'API
 */
export async function deleteWork(idWork, token) {
    const requestResult = await fetch(`http://localhost:5678/api/works/${idWork}`,
        {
        method:"DELETE",
        headers: {'Authorization': `Bearer ${token}`}
        })
    return requestResult.status
}

/**
 * Ajoute un travail dans la base de données par une requête à l'API
 * @param {object } formData - l'objet issu de la récupération des données depuis le formulaire
 * @param {string} token - le token d'authentification
 * @return {number} requestResult.status - le status de la requête renvoyée par l'API
 */
export async function addWork(formData, token) {
    const requestResult = await fetch(`http://localhost:5678/api/works/`,
        {
        method:"POST",
        headers: {'Authorization': `Bearer ${token}`},
        body: formData
        })
    return requestResult.status
}
