console.log('requests chargé')

async function deleteWork(idWork) {
    const result = await fetch(`http://localhost:5678/api/works/${idWork}`,
        {
        method:"DELETE",
        headers: {'Authorization': `Bearer ${token}`}
        })
    return result.status
}
