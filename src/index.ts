const find = function <Type>(selector: string): Type {
    return Array.from(document.querySelectorAll(selector))[0] as Type
}

interface MutableStat<T> {
    lastChanged: number
    value: T
    set: (value: T) => any
    add: (value: T) => any
}

const Game = {
    Money: {
        lastChanged: new Date().getTime(),
        value: 0,

        set: (...params: number[]) => {
            const amount: number = params[0] || 0
            Game.Money.value = amount
            Game.Money.lastChanged = new Date().getTime()
        },

        add: (...params: number[]) => {
            const amount: number = params[0] || 0
            Game.Money.value += amount
            Game.Money.lastChanged = new Date().getTime()
        }
    } as MutableStat<number>
}

const moneyElement = find<HTMLElement> ("#money")
const earnElement =  find<HTMLElement> ("#earn")

earnElement?.addEventListener('click', () => {
    Game.Money.add(1)
    moneyElement.textContent = `${Game.Money.value}`
})