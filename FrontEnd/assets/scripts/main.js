console.log('main.js linké !"')
// import all necessary functions
import { displayCategories, filterWorks } from './filter.js'
import { displayWorks } from './works.js'

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
}

initPage()
