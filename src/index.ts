interface GameProps {
    readonly [x: string]: any
    readonly length: number
}

interface Stop {
    name: {}
    code: number
    timeSecs: number
}

interface Route {
    stops: Stop[]
    totalTimeSecs: number
}

const Routes: GameProps = Object.freeze({
    MakeRoute: (numOfStops: number): Route => {
        const places: GameProps = {
            "Albanese Beach": 1000,
            "Scomoville": 2000,
            "Edison Square": 2100,
            "Finhorn Valley": 1100,
            "Musk": 1110,
            "Eloneville": 3000,
            "Musk Square": 1111,
            "Anthony Corner": 1120,
            "El Salvador": 3100,
            length: 9
        }

        const stops: Stop[] = []

        for (let i = 0; i < numOfStops; i++) {

            const duration: number = Math.max(~~(Math.random() * ~~(((1000 + 2000 + 2100 + 1100 + 1110 + 3000 + 1111 + 1120 + 3100) / 9) / 100)), ~~(((1000 + 2000 + 2100 + 1100 + 1110 + 3000 + 1111 + 1120 + 3100) / 9) / 100) - 13)
            const name = Object.keys(places)[~~(Math.random() * places.length)]

            stops.push({
                name: name,
                code: places[name],
                timeSecs: duration
            })
        }

        return {
            stops: stops,
            totalTimeSecs: ((): number => {
                let time = 0
                stops.forEach((stop: Stop) => {
                    time += stop.timeSecs
                })
                return time
            })()
        }
    },

    TravelRoute: (route: Route) => {
        function loop(stop: Stop) {
            const stopNext = route.stops[route.stops.indexOf(stop) !== route.stops.length - 1 ? route.stops.indexOf(stop) + 1 : -1]
            const stopPrev = route.stops[route.stops.indexOf(stop) !== 0 ? route.stops.indexOf(stop) - 1 : -1]
            console.log((() => {
                if (stopPrev == null) {
                    return `Travelling to ${stop.name} (${stop.code}), which would take ${stop.timeSecs} irl seconds, or ${stop.timeSecs * 5} game minutes.`
                } else {
                    return `Travelling to ${stop.name} (${stop.code}) from ${stopPrev.name} (${stopPrev.code}), which would take ${stop.timeSecs} irl seconds, or ${stop.timeSecs * 5} game minutes.`
                }
            })())
            setTimeout(() => {
                stopNext != null ? loop(stopNext) : console.log(`Finished travelling! Travel took ${route.totalTimeSecs} irl seconds, or ${route.totalTimeSecs * 5} game minutes.`)
            }, stop.timeSecs * 1000)
        }

        loop(route.stops[0])
    },

    length: 2
})

// Place codes help:
// E.G. 
//                  3                                       |           1                                                                                        |                        2                                                                 |                               5
//                  ^                                       |           ^                                                                                        |                        ^                                                                 |                               ^
//  The main place (which would represent a city or alike)  |  The secondary place, which is inside of the main place (which would represent a suburb or alike)  |  The tertiary place, inside of the secondary place (whould represent a valley or alike)  |  The fourth and final place, inside of the tertiary place (represents a mall or alike).

class Bus {

    name: string
    id: number
    hasRoute: boolean = false
    route?: Route
    status: number = 0

    constructor(name: string, id: number, route?: Route) {
        this.name = name
        this.id = id
        if (route) {
            this.addRoute(route)
        }
    }

    public addRoute(route: Route): Bus {
        this.hasRoute = true
        this.route = route
        return this
    }

    public forEach(callbackfn: (k: string, v: number, i: number, a: Stop[]) => void, step?: number, take?: number): void {
        if (this.route) {
            this.route.stops.forEach((stop: Stop, index: number, array: Stop[]) => {
                const keys = Object.keys(stop)

                for (let i = 0; i < keys.length - (take || 0); i += step || 1) {
                    callbackfn(keys[i], Object.values(stop)[i], index, array)
                }
            })
        }
    }

    public removeRoute(): Bus {
        this.hasRoute = false
        this.route = undefined
        return this
    }

    public travel(eventCallbacks: ((status: number, stop: Stop, next: Stop | null, prev: Stop | null) => void)[]): Bus {
        if (!this.route || !this.hasRoute) return this

        const loop = (stop: Stop) => {
            if (!this.route || !this.hasRoute) return

            const i: number = this.route.stops.indexOf(stop)
            console.log(i)
            const next: Stop | undefined = this.route.stops[i !== this.route.stops.length - 1 ? i + 1 : -1]
            const prev: Stop | undefined = this.route.stops[i !== 0 ? i - 1 : -1]

            if (this.status <= 8) eventCallbacks[0](this.status, stop, next != null ? next : null, prev != null ? prev : null)
            else if (this.status === 9) eventCallbacks[1](this.status, stop, next != null ? next : null, prev != null ? prev : null)
            else if (this.status === 10) eventCallbacks[2](this.status, stop, next != null ? next : null, prev != null ? prev : null)

            if (i % 2 === 0 || !(this.status <= 8)) this.status = ~~(Math.random() * 11)

            if (next) {
                setTimeout(() => loop(next), stop.timeSecs * 1000)
            }
        }

        loop(this.route.stops[0])

        return this
    }

    public addToList(list: HTMLElement | null): Bus {
        const html = `
        <b>${this.name}</b>
        <p>(${this.id})</p>
        <br>
        <button id="BUS-${this.id}-CHECK" class="check">Check</button>
        `

        const el = document.createElement('li')
        el.innerHTML = html

        setTimeout(() => {
            const button = document.getElementById(`BUS-${this.id}-CHECK`)
            button?.addEventListener('click', () => {
                this.openDialog()
            })
        }, 100)

        list?.appendChild(el)

        return this
    }

    private addCloseDialogListener() {
        const close = document.getElementById(`BUS-${this.id}-CLOSE`)
        const dialog = document.getElementById(`about-bus`) as HTMLDialogElement
        const content = document.getElementById(`content`)

        if (dialog && content && close) close.addEventListener('click', () => {
            content.setAttribute("class", "noblur")
            dialog.close()
            dialog.innerHTML = ""
        })
    }

    private openDialog() {
        const content: HTMLElement | null = document.getElementById("content")

        const dialog: HTMLDialogElement = document.getElementById("about-bus") as HTMLDialogElement

        const html = `
        <h2>${this.name}</h2>
        <p>${this.status <= 8 ? "Normal" : this.status === 9 ? "Bus has broken down." : this.status === 10 ? "Bus is out of fuel" : "UNKOWN"}</p>
        <p id="BUS-${this.id}-STOP" class="stop">UNKNOWN STOP</p>
        <button id="BUS-${this.id}-CLOSE" class="close">Close</button>
        `

        if (dialog) {
            dialog.innerHTML = html
            content?.setAttribute("class", "blur")
            dialog.showModal()
            setTimeout(this.addCloseDialogListener.bind(this), 100)
        }
    }

    public tick(callbackfn: () => void, s: number) {
        setInterval(callbackfn, s * 1000)
    }
}

let money = 0
let busPrice = 100

const chooseEvent = (): number => {
    const numOfEvents = 3

    return ~~(Math.random() * numOfEvents)
}

const addNewBus = (): boolean => {
    if (money >= busPrice) {
        const name = (document.getElementById("new-bus-name") as HTMLInputElement)?.value
        const newBus = new Bus(name, new Date().getTime())
        const moneyElement = document.getElementById("money")
        const priceElement = document.getElementById("add-new-bus-cost")

        newBus.addToList(document.getElementById("buses"))

        newBus.travel([
            (status: number, stop: Stop, next: Stop | null, prev: Stop | null) => {
                const s = document.querySelector(`BUS-${newBus.id}-STOP`)
                if (s != null) {
                    s.textContent = `Current stop: ${stop.name}, Next stop: ${next?.name || "UNKNOWN"}, Previous stop: ${prev?.name || "UNKNOWN"}`
                }
            },

            (status: number, stop: Stop, next: Stop | null, prev: Stop | null) => {
                const s = document.querySelector(`BUS-${newBus.id}-STOP`)
                if (s != null) {
                    s.textContent = `Current stop: ${stop.name}, Next stop: ${next?.name || "UNKNOWN"}, Previous stop: ${prev?.name || "UNKNOWN"}`
                }
            },

            (status: number, stop: Stop, next: Stop | null, prev: Stop | null) => {
                const s = document.querySelector(`#BUS-${newBus.id}-STOP`)
                if (s != null) {
                    s.textContent = `Current stop: ${stop.name}, Next stop: ${next?.name || "UNKNOWN"}, Previous stop: ${prev?.name || "UNKNOWN"}`
                }
            }
        ])

        money -= busPrice
        if (moneyElement) moneyElement.textContent = money.toString()

        busPrice *= 1.3
        if (priceElement) priceElement.textContent = money.toString()

        return true
    }

    return false
}

const addButton = document.getElementById("add")
const earn = document.getElementById("earn")

earn?.addEventListener("click", () => {
    const moneyElement = document.getElementById("money")

    money++
    if (moneyElement) moneyElement.textContent = money.toString()
})

addButton?.addEventListener('click', () => {
    const content: HTMLElement | null = document.getElementById("content")
    const dialog = (document.getElementById("add-bus") as HTMLDialogElement)
    const add = document.getElementById("add-new-bus")
    const close = document.getElementById("add-bus-close")

    content?.setAttribute("class", "blur")
    dialog.showModal()

    add?.addEventListener('click', () => {
        if (addNewBus()) {
            content?.setAttribute("class", "noblur")
            dialog.close()
        }
    })

    close?.addEventListener('click', () => {
        content?.setAttribute("class", "noblur")
        dialog.close()
    })
})