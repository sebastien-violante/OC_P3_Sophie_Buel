/**
 * Find the list of focusable elements within an element
 * @returns {array} focusableElements - the list of focusable elements
 */
export function getFocusableElements(element) {
        const focusableSelectors = 'button, [href], input, select, a'
        let focusableElements = Array.from(element.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null)
        
        return focusableElements
    }
