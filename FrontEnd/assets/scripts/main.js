console.log('main.js chagé')
// import all necessary functions
import { displayCategories, filterWorks } from './filter.js'
import { enableModify } from './enableModify.js'    
import { displayModal } from './modal.js'

function listenButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn')
    filterButtons.forEach(filterButton => {
        filterButton.addEventListener('click', (event) => {
            filterWorks(event.target.dataset.id)
        })
    })
}

async function initPage() {
    await displayCategories()
    const works = JSON.parse(window.localStorage.getItem('allWorks'))
    await filterWorks(0)
    listenButtons()
    enableModify()
    document.querySelector('.modal').style.display="none"
    displayModal()
}

initPage()
