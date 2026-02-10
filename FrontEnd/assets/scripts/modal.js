import { deleteWork, addWork } from "./utils/requests.js"
import { displayNewWork } from "./utils/display.js"

export async function displayModal(allCategories, token) {

    // Définition des constantes globales
    const modal = document.querySelector('.modal')
    const leftSide = document.querySelector('.left-wrapper')
    const rightSide = document.querySelector('.right-wrapper')
    const errorMessage = modal.querySelector('.errorMessage')
    const btnValidateWork = document.querySelector('.btnValidateWork')
    const categoryValues = Array.from(allCategories).map(category => Number(category.id))
    const choosePictureBtn = document.querySelector('.newPicture')
    const pictureZone = document.querySelector('.pictureZone')
    const titleInput = document.querySelector('.textualInputs [name="title"]')
    const categoryInput = document.querySelector('.form-modal select[name="category"]')
    let listFigureId = ((Array.from(modal.querySelectorAll('figure'))).map(figure => figure.dataset['id']))
    let focusables = []
    let firstSlideLastIndex = null
    let changeSlide
    let index = focusables.findIndex(element => element === modal.querySelector(':focus'))
    const deleteChosenPicture = modal.querySelector('.deleteChosenPicture')
    
    if(document.querySelector('.enableModify')) {
        document.querySelector('.enableModify').addEventListener('click', (event)=>{
        event.preventDefault()
        modal.style.display = "flex"
        leftSide.style.display="block"
        modal.setAttribute('aria-hidden', 'false');
        // Liste des éléments focusables dans la modale
        focusables = getFocusableElements()
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
    
    function getFocusableElements() {
        const focusableSelectors = 'button, [href], input, select'
        return Array.from(modal.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);
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
    document.querySelectorAll('.closeCross').forEach(closeCross => {
        closeCross.addEventListener('click', (event)=>{
            event.preventDefault()
            initModal()
            document.querySelector('.enableModify').focus()
        })
    })

    // Fermeture de la modale par clic en dehors
    modal.addEventListener('click', (event)=>{
        if(event.target === modal) {
            initModal()
            document.querySelector('.enableModify').focus()
        }
    })  

    // Détermination de l'index de "bascule"
    function getChangeSlideIndex() {
        focusables = getFocusableElements()
        const changeSlideIndex = focusables.findIndex(el =>
            el.classList.contains('btnAddPhoto')
        )
        return changeSlideIndex
    }

    // Méthode de focus trap
    const focusInModal = function(event) {
        
       firstSlideLastIndex = getChangeSlideIndex()
       event.preventDefault()
        if(event.shiftKey === true) {
            index--
            if(index === firstSlideLastIndex) changeSide()
        } else {
            index++ 
            if(index === firstSlideLastIndex+1) changeSide()
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
    // Fermeture de la modale par touche ESCAPE et gestion du focus trap
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
        
        if(event.target.parentNode.classList.contains("deleteIcon")) {
            event.preventDefault()
            const status = await deleteWork(event.target.parentNode.id, token)
            if(status === 204) {
                event.target.closest('figure').style.display="none"
                document.querySelector(`.gallery [data-id="${event.target.parentNode.id}"]`).style.display="none"
                focusables = getFocusableElements()
                firstSlideLastIndex = getChangeSlideIndex()
                focusables[1].focus()
                index = 1
            }
        }
    })
    // Suppression d'un travail au clavier (attention : target = image)
    modal.addEventListener('keydown', async (event)=>{
        if(event.key === "Enter" && event.target.classList.contains("deleteIcon")) {
            const status = await deleteWork(event.target.id, token)
            if(status === 204) {
                event.target.closest('figure').style.display="none"
                document.querySelector(`.gallery [data-id="${event.target.id}"]`).style.display="none"
                focusables = getFocusableElements()
                firstSlideLastIndex = getChangeSlideIndex()
                focusables[1].focus()
                index = 1
            }
        }
    })
    // Gestion de l'ouverture du champ file par le clavier (attention : target = lien)
    modal.querySelector('.choosePictureLabel').addEventListener('keydown', (event) => {
        if (event.key === "Enter" || event.key === ' ') {
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
                deleteChosenPicture.classList.remove('hidden')
                formInputs.file = file
                formInputs.url = event.target.result
                checkFormInputs(formInputs)

            }
            reader.readAsDataURL(file)
        }
    })

    // Suppression de la photo sélectionnée
    deleteChosenPicture.addEventListener('click', (event) => {
        event.preventDefault()
        pictureZone.style.backgroundImage="" 
        document.querySelector('.choosePicture').style.display = "flex"
        errorMessage.innerHTML = ""
        event.target.classList.add('hidden')
        focusables = getFocusableElements()
        firstSlideLastIndex = getChangeSlideIndex()
    })

    // Ecouteur d'évènement sur le champ titre
    titleInput.addEventListener('keyup', function(){
        formInputs.title = titleInput.value
        checkFormInputs(formInputs)
    })

    // Ecouteur d'évènement sur le select
    categoryInput.addEventListener('change', function(){
        formInputs.categoryId = categoryInput.value
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
                if(!categoryValues.includes(Number(formInputs.categoryId))) {
                    throw new Error ('le choix de cette catégorie n\'est pas possible')
                }

                // suppression des messages d'erreur
                errorMessage.innerHTML = ""

                const formData = new FormData()
                formData.append('image', formInputs.file )
                formData.append('title', formInputs.title)
                formData.append('category', Number(formInputs.categoryId))
                
                const requestResult = await addWork(formData, token)
                if(requestResult === 201) {
                    // Attribution d'un nouvel id au travail en fonction des id déjà existants
                    let lastWorkId = Number(listFigureId[listFigureId.length-1])
                    const newId = lastWorkId+1
                    listFigureId.push(newId)
                    formInputs.id=newId
                    displayNewWork(formInputs)
                    focusables = getFocusableElements()
                    firstSlideLastIndex = getChangeSlideIndex()
                    focusables[1].focus()
                    index = 1
                    reInitForm()
                    changeSide()
                } else {
                    console.log(requestResult)
                }

            } catch(error) {
                document.querySelector('.errorMessage').innerHTML = `<p>${error.message}</p>`
            }
    }

    function enableValidateForm(formInputs,token, errorMessage) {
        btnValidateWork.removeEventListener('click', validateForm)
        btnValidateWork.addEventListener('click', validateForm)
    }

    enableValidateForm(formInputs,token, errorMessage)

}

