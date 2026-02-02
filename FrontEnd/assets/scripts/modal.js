export async function displayModal() {
    const modal = document.querySelector('.modal')
    const leftSide = document.querySelector('.left-wrapper')
    const rightSide = document.querySelector('.right-wrapper')
    const deleteIcons = modal.querySelectorAll('.deleteIcon')
    
    // Récupération catégories et remplissage du select
    const responseAllCategories = await fetch('http://localhost:5678/api/categories')
        
        if (!responseAllCategories.ok) {
            throw new Error(`Erreur statut HTTP : ${responseAllCategories.status}`);
        }
        const allCategories = await responseAllCategories.json()
        
        allCategories.forEach( category => {
            const option = document.createElement('option')
            option.value = category.id
            option.innerText = category.name
            document.querySelector('.form-modal select[name="category"]').appendChild(option)
        })

    // Affichage de la modale
    document.querySelector('.enableModify').addEventListener('click', ()=>{
        modal.style.display = "flex"
        leftSide.style.display="block"
        modal.setAttribute('aria-hidden', 'false');
    })

    // Fermeture de la modale par clic sur la croix
    document.querySelector('.closeCross').addEventListener('click', ()=>{
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true');
        rightSide.style.display="none"

    })

    // Fermeture de la modale par clic en dehors
    modal.addEventListener('click', (event)=>{
        if(event.target === modal) {
            modal.style.display = "none"
            modal.setAttribute('aria-hidden', 'true');
            rightSide.style.display="none"
        }
    })

    // Affichage de la deuxième partie de la modale
    modal.querySelector('.btnAddPhoto').addEventListener('click', () => {
        leftSide.classList.toggle('visible')
        rightSide.classList.toggle('visible')
    })

    // Affichage de la première partie de la modale
    modal.querySelector('.toLeftArrow').addEventListener('click', () => {
        leftSide.classList.toggle('visible')
        rightSide.classList.toggle('visible')
    })

    // Suppression d'un travail au clic sur une icone poubelle
    deleteIcons.forEach(icon => {
        const token = localStorage.getItem('token')
        icon.addEventListener('click', async (event) => {
            const status = await deleteWork(event.target.id)
            if(status === 204) {
                event.target.closest('figure').style.display="none"
            }
            console.log(status)
        })

    })

    // Validation du formulaire
    document.querySelector('.btnValidatePhoto').addEventListener('click', (event) => {
        event.preventDefault()
        console.log(event.target)
        try{
            const file = document.querySelector('.form-modal .newPictureName').value
            console.log(file)
        } catch(error){
            console.log(error.message)
        }
    })



}

