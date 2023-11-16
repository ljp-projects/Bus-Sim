const find = function <Type>(selector: string): Type {
    return Array.from(document.querySelectorAll(selector))[0] as Type
}

interface MutableStat<T> {
    lastChanged: number
    value: T
    set?: (value: T) => any
    add?: (value: T) => any
    take?: (value: T) => any
}

interface ImmutableStat<T> {
    readonly created: number
    readonly value: T
}

const Player = {
    /**
     * The players bus lines.
     * [NAME, ID]
     */
    Lines: {
        created: new Date().getTime(),
        value: [
            ["", 2]
        ]
    } as ImmutableStat<[string, number][]>
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
        },

        take: (...params: number[]) => {
            const amount: number = params[0] || 0
            Game.Money.value -= amount
            Game.Money.lastChanged = new Date().getTime()
        }
    } as MutableStat<number>,

    Increment: {
        created: new Date().getTime(),
        value: 1.3
    } as ImmutableStat<number>,

    Update: {
        created: new Date().getTime(),
        value: (frequencyMilli: number) => {
            setInterval(() => {
                moneyElement.textContent = `${Game.Money.value}`
            }, frequencyMilli)
        }
    } as ImmutableStat<(frequencyMilli: number) => void>
}

const moneyElement =   find<HTMLElement> ("#money")
const earnElement =    find<HTMLElement> ("#earn")
const linesElement =   find<HTMLElement> ("#lines")
const addLineElement = find<HTMLElement> ("#line")

earnElement?.addEventListener('click', () => {
    if (Game.Money.add) Game.Money.add(1)
})

addLineElement?.addEventListener("click", () => {
    if (Game.Money.value >= 100) {
        const name: string = prompt("What shall the name of the line be?") || "BUS LINE NAME"
        const id: number = new Date().getTime() || 0
        const generatedLine: [string, number] = [name, id]
        const generatedHTMLLine = `
        <li style="list-style: none;" id="BUS-LINE-${id}">
            <b id="BUS-LINE-${id}-NAME">${name}</b>
            <p id="BUS-LINE-${id}-ID">${id}</p>
        </li>
        `

        Player.Lines.value.push(generatedLine)
        linesElement.innerHTML  += generatedHTMLLine
        if (Game.Money.take) Game.Money.take(100)
    } else {
        alert(`You need more money.`)
    }
})

Game.Update.value(50)