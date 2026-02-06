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


// Requête d'authentification
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
        window.sessionStorage.setItem('userId', authenticateResponse.userId)
        
        return  authenticateResponse.token
    }
}

// Requête de suppression d'un travail
export async function deleteWork(idWork, token) {
    const requestResult = await fetch(`http://localhost:5678/api/works/${idWork}`,
        {
        method:"DELETE",
        headers: {'Authorization': `Bearer ${token}`}
        })
    return requestResult.status
}

// Requête d'ajout d'un travail
export async function addWork(formData, token) {
    const requestResult = await fetch(`http://localhost:5678/api/works/`,
        {
        method:"POST",
        headers: {'Authorization': `Bearer ${token}`},
        body: formData
        })
    return requestResult.status
}
