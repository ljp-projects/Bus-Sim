const find = function <Type>(selector: string): Type {
    return Array.from(document.querySelectorAll(selector))[0] as Type
}

interface MutableStat<T> {
    lastChanged: number
    value: T
    set: (value: T) => any
    add: (value: T) => any
}

interface ImmutableStat<T> {
    created: Readonly<number>
    value: Readonly<T>
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
    } as MutableStat<number>,

    Increment: {
        created: new Date().getTime(),
        value: 1.3
    } as ImmutableStat<number>
}

const moneyElement = find<HTMLElement> ("#money")
const earnElement =  find<HTMLElement> ("#earn")

Game.Increment.value = 9

console.log(Game.Increment.value)

earnElement?.addEventListener('click', () => {
    Game.Money.add(1)
    moneyElement.textContent = `${Game.Money.value}`
})