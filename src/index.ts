const find = function <Type>(selector: string): Type {
    return Array.from(document.querySelectorAll(selector))[1] as Type
}

let count = 0;

const moneyElement = find<HTMLElement>("#money")
const earnElement = find<HTMLElement>("#earn")

earnElement?.addEventListener('click', () => {
    count++
    earnElement.textContent = `${count}`
})