import { deleteWork, addWork } from "./utils/requests.js"
import { displayNewWork } from "./utils/display.js"

export async function displayModal(allCategories, token) {

    // Définition des constantes globales
    const modal = document.querySelector('.modal')
    const leftSide = document.querySelector('.left-wrapper')
    const rightSide = document.querySelector('.right-wrapper')
    const errorMessage = document.querySelector('.errorMessage')
    const btnValidateWork = document.querySelector('.btnValidateWork')
    const categoryValues = allCategories.map(category => Number(category.id))
    const choosePictureBtn = document.querySelector('.newPicture')
    const pictureZone = document.querySelector('.pictureZone')
    const titleInput = document.querySelector('.textualInputs [name="title"]')
    const categoryInput = document.querySelector('.form-modal select[name="category"]')
    let listFigureId = ((Array.from(modal.querySelectorAll('figure'))).map(figure => figure.dataset['id']))
    const focusableSelector = 'button, a, input, select'
    let focusables = []
    let index = focusables.findIndex(element => element === modal.querySelector(':focus'))
    
    if(document.querySelector('.enableModify')) {
        document.querySelector('.enableModify').addEventListener('click', (event)=>{
        event.preventDefault()
        modal.style.display = "flex"
        leftSide.style.display="block"
        modal.setAttribute('aria-hidden', 'false');
        // Liste des éléments focusables dans la modale
        focusables = Array.from(modal.querySelectorAll(focusableSelector))
        // Initialisation du focus à l'intérieur de la modale
        focusables[0].focus()

    })
    }

    // Ajout des options du select category
    allCategories.forEach( category => {
        const option = document.createElement('option')
        option.value = category.id
        option.innerText = category.name
        categoryInput.appendChild(option)
     })

    const formInputs = {
        file: "",
        title: "",
        categoryId: categoryInput.value,
        url: "",
        id: null
    }
                
    function initModal() {
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true');
        leftSide.classList.add('visible')
        rightSide.classList.remove('visible')
        rightSide.querySelector('.pictureZone').style.backgroundImage = ""
        rightSide.querySelector('.choosePicture').style.display = "flex"
        focusables[0].focus()
    }
    
    // Fermeture de la modale par clic sur la croix
    document.querySelector('.closeCross').addEventListener('click', (event)=>{
        event.preventDefault()
        initModal()
        document.querySelector('.enableModify').focus()

    })

    // Fermeture de la modale par clic en dehors
    modal.addEventListener('click', (event)=>{
        if(event.target === modal) {
            initModal()
            document.querySelector('.enableModify').focus()
        }
    })

    // Méthode de focus trap
    const focusInModal = function(event) {
        event.preventDefault()
        if(event.shiftKey === true) {
            index--
            if(index === 1) changeSide()
            console.log(index)
        } else {
            index++ 
            if(index === 2) changeSide()
            console.log(index)
        }    
        if(index > focusables.length - 1) {
            index = 0
            changeSide()
        }
        if(index < 0) {
            changeSide()
            index = focusables.length - 1
        }
        focusables[index].focus()
    }
    // Fermuture de la modale par touche ESCAPE et gestion du focus trap
    window.addEventListener('keydown', (event) => {
        if(event.key === "Escape" || event.key === "Esc") {
            initModal()
        }
        if(event.key === 'Tab' && modal.getAttribute('aria-hidden') === 'false') {
            focusInModal(event)
        }

    })

    // Changement de partie de la modale
    function changeSide() {
        leftSide.classList.toggle('visible')
        rightSide.classList.toggle('visible')
    }

    // Affichage de la deuxième partie de la modale par clic
    modal.querySelector('.btnAddPhoto').addEventListener('click', (event) => {
        event.preventDefault()
        changeSide()
    })

    // Gestion de l'ouverture de la recherche de fichier avec utilisation clavier sur label
    modal.querySelector('.choosePictureLabel').addEventListener('keydown', (event) => {
        if(event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            modal.querySelector('#fileInput').click()
        }
    })
   
    // Affichage de la première partie de la modale
    modal.querySelector('.toLeftArrow').addEventListener('click', (event) => {
        event.preventDefault()
        changeSide()
    })

    // Suppression d'un travail au clic sur une icone poubelle
    modal.addEventListener('click', async (event)=>{
        if(event.target.classList.contains("deleteIcon")) {
            const status = await deleteWork(event.target.id, token)
            if(status === 204) {
                console.log(event.target)
                event.target.closest('figure').style.display="none"
                document.querySelector(`.gallery [data-id="${event.target.id}"]`).style.display="none"
            }
        }
    })
    
    // Gestion de l'ouverture du champ file par le clavier 
    modal.querySelector('.choosePictureLabel').addEventListener('keydown', (event) => {
        if (event.key === "Enter" || event.key === ' ') {
            console.log('ouvert')
            event.preventDefault();
            modal.querySelector('#fileInput').click();
        }
    });

    // Prévisualisation de la photo choisie
    choosePictureBtn.addEventListener('change', function() {
        const file = this.files[0]
        if(file) {
            const reader = new FileReader()
            reader.onload = function (event) {
                document.querySelector('.choosePicture').style.display = "none"
                pictureZone.style.backgroundImage=`url(${event.target.result})` 
                formInputs.file = file
                formInputs.url = event.target.result
                checkFormInputs(formInputs)

            }
            reader.readAsDataURL(file)
        }
    })

    // Ecouteur d'évènement sur le champ titre
    titleInput.addEventListener('keyup', function(){
        formInputs.title = titleInput.value
        checkFormInputs(formInputs)
    })

    // Ecouteur d'évènement sur le select
    //const categoryInput = document.querySelector('.textualInputs [name="category"]')
    categoryInput.addEventListener('change', function(){
        formInputs.categoryId = categoryInput.value
        console.log('categorie choisie :'+formInputs.category)
        checkFormInputs(formInputs)
    })

    // Autorisation de validation du formulaire
    function checkFormInputs(formInputs) {
        if(formInputs.file && formInputs.title.trim() !== "") {
            //enableValidateForm(formInputs)
            btnValidateWork.removeAttribute('disabled')
            btnValidateWork.classList.add('enableValidate')
        } else {
            document.querySelector('.btnValidateWork').setAttribute('disabled', true)
            document.querySelector('.btnValidateWork').classList.remove('enableValidate')
        }
    }

    // Réinitialisation du formulaire après saisie
    function reInitForm() {
        pictureZone.style.backgroundImage="none" 
        titleInput.value = ""
        document.querySelector('.choosePicture').style.display = "flex"
        // Remise à zéro du formInputs
        formInputs.title = ""
        formInputs.file = ""
        formInputs.url = ""
        formInputs.id = null
        checkFormInputs(formInputs)
    }

    async function validateForm(event) {
            event.preventDefault()
            console.log(formInputs)
            try {
                // traitement du champ image
                const validTypes=['image/jpeg', 'image/jpg', 'image/png']
                const maxSize = 4*1024*1024
                if(!validTypes.includes(formInputs.file.type)) {
                    throw new Error('Le format de l\'image n\'est pas valide') 
                }
                if(formInputs.file.size > maxSize) {
                    throw new Error('La taille de l\'image est trop grande') 
                }
                // Traitement du champ titre
                if(formInputs.title.length<2) {
                    throw new Error('Le titre doit comprendre au moins 2 caractères') 
                }
                if(!/^[A-Za-zÀ-ÖØ-öø-ÿ .()\-:,']{2,}$/.test(formInputs.title)) {
                    throw new Error('Le titre doit comprendre au moins 2 caractères alphanumériques ou certains caractères spéciaux') 
                }

                // Traitement du champ catégorie
                console.log(Number(formInputs.categoryId))
                console.log(categoryValues)
                if(!categoryValues.includes(Number(formInputs.categoryId))) {
                    throw new Error ('le choix de cette catégorie n\'est pas possible')
                }

                // suppression des messages d'erreur
                errorMessage.innerHTML = ""

                const formData = new FormData()
                formData.append('image', formInputs.file )
                formData.append('title', formInputs.title)
                formData.append('category', Number(formInputs.categoryId))
                for (const [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                const requestResult = await addWork(formData, token)
                if(requestResult === 201) {
                    // Attribution d'un nouvel id au travail en fonction des id déjà existants
                    let lastWorkId = Number(listFigureId[listFigureId.length-1])
                    const newId = lastWorkId+1
                    listFigureId.push(newId)
                    formInputs.id=newId
                    displayNewWork(formInputs)
                    reInitForm()
                } else {
                    console.log(requestResult)
                }

            } catch(error) {
                console.log(error.message)
                document.querySelector('.errorMessage').innerHTML = `<p>${error.message}</p>`
            }
    }

    function enableValidateForm(formInputs,token, errorMessage) {
        btnValidateWork.removeEventListener('click', validateForm)
        btnValidateWork.addEventListener('click', validateForm)
    }

    enableValidateForm(formInputs,token, errorMessage)

}

