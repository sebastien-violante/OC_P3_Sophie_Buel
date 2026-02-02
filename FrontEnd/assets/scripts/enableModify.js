export function enableModify() {
    let token1 = window.localStorage.getItem('token')
    console.log(token1)
    function setEnableModify() {
        console.log(document.querySelector('#portfolio .title'))
        if(token1 == null) {
            document.querySelector('#portfolio .title').innerHTML = '<h2>Mes projets</h2>'
        } else {
            document.querySelector('#portfolio .title').innerHTML = '<h2>Mes projets</h2><div class="enableModify"><img class="enableModifyIcon" src="./assets/icons/modify.png"><p>modifier</p></div>'
            document.querySelector('#portfolio .filters').innerHTML = ""
        }
    }

    setEnableModify()
}


