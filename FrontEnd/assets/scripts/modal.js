import { deleteWork, addWork } from "./utils/requests.js"
import { displayNewWork } from "./utils/display.js"
import { getFocusableElements } from "./utils/focusTrap.js"

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
    let firstSlideLastIndex = null
    let focusables = []
    let index = focusables.findIndex(element => element === modal.querySelector(':focus'))

    // Définition des fonctions

    /**
        * Display the modal and initialize each part
    */
    function initModal() {
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true');
        leftSide.classList.add('visible')
        rightSide.classList.remove('visible')
        rightSide.querySelector('.pictureZone').style.backgroundImage = ""
        rightSide.querySelector('.choosePicture').style.display = "flex"
        index = 0
        focusables[0].focus()
    }

    /**
        * Determines the index used to change slide
        * @return {number} - changeSlideIndex : the transition index between the two parts of the modal
    */
    function getChangeSlideIndex() {
        focusables = getFocusableElements(modal)
        const changeSlideIndex = focusables.findIndex(el =>
            el.classList.contains('btnAddPhoto')
        )
        return changeSlideIndex
    }


    // Apparition de la modale si présence de la mention "Modifier"
    if(document.querySelector('.enableModify')) {
        document.querySelector('.enableModify').addEventListener('click', (event)=>{
        event.preventDefault()
        modal.style.display = "flex"
        leftSide.style.display="block"
        modal.setAttribute('aria-hidden', 'false');
        // Liste des éléments focusables dans la modale
        focusables = getFocusableElements(modal)
        console.log(focusables)
        // Initialisation du focus à l'intérieur de la modale
        focusables[0].focus()
    })
    }

    
    // Ajout des options du select category
    const categoryArray = Array.from(allCategories)
    for(let index = 1; index < categoryArray.length; index++) {
        const option = document.createElement('option')
        option.value = categoryArray[index].id
        option.innerText = categoryArray[index].name
        categoryInput.appendChild(option)
    }
    
    // Initialisation de l'objet formInputs pour le traitement de l'autorisation de validation du formulaire
    const formInputs = {
        file: "",
        title: "",
        categoryId: categoryInput.value,
        url: "",
        id: null
    }
    
    
        
    // Fermeture de la modale par clic sur la croix
    document.querySelectorAll('.closeCross').forEach(closeCross => {
        closeCross.addEventListener('click', (event)=>{
            event.preventDefault()
            initModal()
            reInitForm()
            document.querySelector('.enableModify').focus()
        })
    })

    // Fermeture de la modale par clic en dehors
    modal.addEventListener('click', (event)=>{
        if(event.target === modal) {
            initModal()
            reInitForm()
            document.querySelector('.enableModify').focus()
        }
    })  

    // Méthode de focus trap
    const focusInModal = function(event) {
        
       firstSlideLastIndex = getChangeSlideIndex()
       event.preventDefault()
        if(event.shiftKey === true) {
            index--
            console.log(index)
            if(index === firstSlideLastIndex) changeSide()
        } else {
            index++ 
            console.log(index)
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

    // Changement de côté par appui sur entrée sur le bouton ajout photo
    modal.querySelector('.btnAddPhoto').addEventListener('keydown', (event) => {
        if(event.key === 'Enter' || event.key === ' ') {
            index = firstSlideLastIndex+1
            modal.querySelector('.toLeftArrow').focus()
            console.log('nouvel index :'+index)
        }
    })

    // Changement de côté par appui sur entrée sur la flèche retour
     modal.querySelector('.toLeftArrow').addEventListener('keydown', (event) => {
        if(event.key === 'Enter' || event.key === ' ') {
            index = firstSlideLastIndex
            modal.querySelector('.btnAddPhoto').focus()
            console.log('nouvel index :'+index)
        }
    })
    
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

    // Affichage de la deuxième partie de la modale par clic
    modal.querySelector('.btnAddPhoto').addEventListener('click', (event) => {
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
                focusables = getFocusableElements(modal)
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
                focusables = getFocusableElements(modal)
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
/*
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
*/
/*
    // Suppression de la photo sélectionnée
    deleteChosenPicture.addEventListener('click', (event) => {
        event.preventDefault()
        pictureZone.style.backgroundImage="" 
        document.querySelector('.choosePicture').style.display = "flex"
        //errorMessage.innerHTML = ""
        event.target.parentNode.classList.add('hidden')
        focusables = getFocusableElements()
        firstSlideLastIndex = getChangeSlideIndex()
    })
*/
    // Ecouteur d'évènement sur le champ image
    choosePictureBtn.addEventListener('change', function(event) {
        const file = this.files[0]
        const validTypes=['image/jpeg', 'image/jpg', 'image/png']
        const maxSize = 4*1024*1024
        if(file) {
            try {
            if(!validTypes.includes(file.type)) {
                formInputs.file = ""
                throw new Error('Le format de l\'image n\'est pas valide') 
            }
            if(file.size > maxSize) {
                formInputs.file = ""
                throw new Error('La taille de l\'image est trop grande') 
            }
                errorMessage.innerHTML = ""
                const reader = new FileReader()
                reader.onload = function (event) {
                    modal.querySelector('.default-picture').style.display="none"
                    modal.querySelector('.imgTypes').style.display="none"
                    modal.querySelector('.choosePictureLabel').classList.toggle('large')
                    modal.querySelector('.choosePictureLabel').innerHTML=""
                    modal.querySelector('.choosePictureLabel').style.backgroundImage=`url(${event.target.result})` 
                    formInputs.file = file
                    formInputs.url = event.target.result
                    checkFormInputs(formInputs)
                }
                reader.readAsDataURL(file)
            } catch(error) {
                checkFormInputs(formInputs)
                errorMessage.innerHTML = error.message
            }
        }
    })
    // Ecouteur d'évènement sur le champ titre
    titleInput.addEventListener('change', function(event){
        errorMessage.innerHTML = ""
        const title = event.target.value.trim()
        try {
            if(title.length < 5) {
                formInputs.title = ""
                throw new Error('Le titre doit comprendre au moins 5 caractères') 
            }
            if(!/^[A-Za-zÀ-ÖØ-öø-ÿ .()\-:,']{2,}$/.test(title)) {
                formInputs.title = ""
                throw new Error('Le titre doit comprendre des caractères alphanumériques ou certains caractères spéciaux') 
            }
            formInputs.title = title
            checkFormInputs(formInputs)
        } catch(error) {
            checkFormInputs(formInputs)
            errorMessage.innerHTML = error.message
        }
     })
     /*
    titleInput.addEventListener('keyup', function(){
        formInputs.title = titleInput.value
        checkFormInputs(formInputs)
    })
*/
    // Ecouteur d'évènement sur le select
    categoryInput.addEventListener('change', function(){
        formInputs.categoryId = categoryInput.value
        checkFormInputs(formInputs)
    })

    // Autorisation de validation du formulaire
    function checkFormInputs(formInputs) {
        if(formInputs.file && formInputs.title && categoryValues.includes(Number(formInputs.categoryId))) {
            btnValidateWork.removeAttribute('disabled')
            btnValidateWork.classList.add('enableValidate')
        } else {
            document.querySelector('.btnValidateWork').setAttribute('disabled', true)
            document.querySelector('.btnValidateWork').classList.remove('enableValidate')
        }
    }

    // Réinitialisation du formulaire après saisie
    function reInitForm() {
        document.querySelector('form').reset()
        errorMessage.innerHTML = ""
        pictureZone.style.backgroundImage="none" 
        //titleInput.value = ""
        //choosePictureBtn.file=""
        modal.querySelector('.default-picture').style.display="block"
        modal.querySelector('.imgTypes').style.display="block"
        modal.querySelector('.choosePictureLabel').classList.remove('large')
        modal.querySelector('.choosePictureLabel').innerHTML="+ Ajouter photo"
        modal.querySelector('.choosePictureLabel').style.backgroundImage=""

        // Remise à zéro du formInputs
        formInputs.title = ""
        formInputs.file = ""
        formInputs.url = ""
        formInputs.id = null
        checkFormInputs(formInputs)
    }

    async function validateForm(event) {
            event.preventDefault()
            //try {
            /*
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
                    throw new Error('Le titre doit comprendre au moins 2 caractères') 
                }

                // Traitement du champ catégorie
                if(!categoryValues.includes(Number(formInputs.categoryId))) {
                    throw new Error ('le choix de cette catégorie n\'est pas possible')
                }
            */
                // suppression des messages d'erreur
                //errorMessage.innerHTML = ""

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
                    focusables = getFocusableElements(modal)
                    firstSlideLastIndex = getChangeSlideIndex()
                    //focusables[1].focus()
                    //index = 1
                    reInitForm()
                    //changeSide()
                } else {
                  console.log(requestResult)
                }

            //} catch(error) {
            //    document.querySelector('.errorMessage').innerHTML = `<p>${error.message}</p>`
            //}
    }

    function enableValidateForm(formInputs,token, errorMessage) {
        btnValidateWork.removeEventListener('click', validateForm)
        btnValidateWork.addEventListener('click', validateForm)
    }

    enableValidateForm(formInputs,token, errorMessage)
   
}


