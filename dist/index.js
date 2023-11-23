"use strict";
const Routes = Object.freeze({
    MakeRoute: (numOfStops) => {
        const places = {
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
        };
        const stops = [];
        for (let i = 0; i < numOfStops; i++) {
            const duration = Math.max(~~(Math.random() * ~~(((1000 + 2000 + 2100 + 1100 + 1110 + 3000 + 1111 + 1120 + 3100) / 9) / 100)), ~~(((1000 + 2000 + 2100 + 1100 + 1110 + 3000 + 1111 + 1120 + 3100) / 9) / 100) - 13);
            const name = Object.keys(places)[~~(Math.random() * places.length)];
            stops.push({
                name: name,
                code: places[name],
                timeSecs: duration
            });
        }
        return {
            stops: stops,
            totalTimeSecs: (() => {
                let time = 0;
                stops.forEach((stop) => {
                    time += stop.timeSecs;
                });
                return time;
            })()
        };
    },
    TravelRoute: (route) => {
        function loop(stop) {
            const stopNext = route.stops[route.stops.indexOf(stop) !== route.stops.length - 1 ? route.stops.indexOf(stop) + 1 : -1];
            const stopPrev = route.stops[route.stops.indexOf(stop) !== 0 ? route.stops.indexOf(stop) - 1 : -1];
            console.log((() => {
                if (stopPrev == null) {
                    return `Travelling to ${stop.name} (${stop.code}), which would take ${stop.timeSecs} irl seconds, or ${stop.timeSecs * 5} game minutes.`;
                }
                else {
                    return `Travelling to ${stop.name} (${stop.code}) from ${stopPrev.name} (${stopPrev.code}), which would take ${stop.timeSecs} irl seconds, or ${stop.timeSecs * 5} game minutes.`;
                }
            })());
            setTimeout(() => {
                stopNext != null ? loop(stopNext) : console.log(`Finished travelling! Travel took ${route.totalTimeSecs} irl seconds, or ${route.totalTimeSecs * 5} game minutes.`);
            }, stop.timeSecs * 1000);
        }
        loop(route.stops[0]);
    },
    length: 2
});
// Place codes help:
// E.G. 
//                  3                                       |           1                                                                                        |                        2                                                                 |                               5
//                  ^                                       |           ^                                                                                        |                        ^                                                                 |                               ^
//  The main place (which would represent a city or alike)  |  The secondary place, which is inside of the main place (which would represent a suburb or alike)  |  The tertiary place, inside of the secondary place (whould represent a valley or alike)  |  The fourth and final place, inside of the tertiary place (represents a mall or alike).
class Bus {
    constructor(name, id, route) {
        this.hasRoute = false;
        this.status = 0;
        this.name = name;
        this.id = id;
        if (route) {
            this.addRoute(route);
        }
    }
    addRoute(route) {
        this.hasRoute = true;
        this.route = route;
        return this;
    }
    forEach(callbackfn, step, take) {
        if (this.route) {
            this.route.stops.forEach((stop, index, array) => {
                const keys = Object.keys(stop);
                for (let i = 0; i < keys.length - (take || 0); i += step || 1) {
                    callbackfn(keys[i], Object.values(stop)[i], index, array);
                }
            });
        }
    }
    removeRoute() {
        this.hasRoute = false;
        this.route = undefined;
        return this;
    }
    travel(eventCallbacks) {
        if (!this.route || !this.hasRoute)
            return this;
        const loop = (stop) => {
            if (!this.route || !this.hasRoute)
                return;
            const i = this.route.stops.indexOf(stop);
            console.log(i);
            const next = this.route.stops[i !== this.route.stops.length - 1 ? i + 1 : -1];
            const prev = this.route.stops[i !== 0 ? i - 1 : -1];
            if (this.status <= 8)
                eventCallbacks[0](this.status, stop, next != null ? next : null, prev != null ? prev : null);
            else if (this.status === 9)
                eventCallbacks[1](this.status, stop, next != null ? next : null, prev != null ? prev : null);
            else if (this.status === 10)
                eventCallbacks[2](this.status, stop, next != null ? next : null, prev != null ? prev : null);
            if (i % 2 === 0 || !(this.status <= 8))
                this.status = ~~(Math.random() * 11);
            if (next) {
                setTimeout(() => loop(next), stop.timeSecs * 1000);
            }
        };
        loop(this.route.stops[0]);
        return this;
    }
    addToList(list) {
        const html = `
        <b>${this.name}</b>
        <p>(${this.id})</p>
        <br>
        <button id="BUS-${this.id}-CHECK" class="check">Check</button>
        `;
        const el = document.createElement('li');
        el.innerHTML = html;
        setTimeout(() => {
            const button = document.getElementById(`BUS-${this.id}-CHECK`);
            button === null || button === void 0 ? void 0 : button.addEventListener('click', () => {
                this.openDialog();
            });
        }, 100);
        list === null || list === void 0 ? void 0 : list.appendChild(el);
        return this;
    }
    addCloseDialogListener() {
        const close = document.getElementById(`BUS-${this.id}-CLOSE`);
        const dialog = document.getElementById(`about-bus`);
        const content = document.getElementById(`content`);
        if (dialog && content && close)
            close.addEventListener('click', () => {
                content.setAttribute("class", "noblur");
                dialog.close();
                dialog.innerHTML = "";
            });
    }
    openDialog() {
        const content = document.getElementById("content");
        const dialog = document.getElementById("about-bus");
        const html = `
        <h2>${this.name}</h2>
        <p>${this.status <= 8 ? "Normal" : this.status === 9 ? "Bus has broken down." : this.status === 10 ? "Bus is out of fuel" : "UNKOWN"}</p>
        <p id="BUS-${this.id}-STOP" class="stop">UNKNOWN STOP</p>
        <button id="BUS-${this.id}-CLOSE" class="close">Close</button>
        `;
        if (dialog) {
            dialog.innerHTML = html;
            content === null || content === void 0 ? void 0 : content.setAttribute("class", "blur");
            dialog.showModal();
            setTimeout(this.addCloseDialogListener.bind(this), 100);
        }
    }
    tick(callbackfn, s) {
        setInterval(callbackfn, s * 1000);
    }
}
let money = 0;
let busPrice = 100;
const chooseEvent = () => {
    const numOfEvents = 3;
    return ~~(Math.random() * numOfEvents);
};
const addNewBus = () => {
    var _a;
    if (money >= busPrice) {
        const name = (_a = document.getElementById("new-bus-name")) === null || _a === void 0 ? void 0 : _a.value;
        const newBus = new Bus(name, new Date().getTime());
        const moneyElement = document.getElementById("money");
        const priceElement = document.getElementById("add-new-bus-cost");
        newBus.addToList(document.getElementById("buses"));
        newBus.travel([
            (status, stop, next, prev) => {
                const s = document.querySelector(`BUS-${newBus.id}-STOP`);
                if (s != null) {
                    s.textContent = `Current stop: ${stop.name}, Next stop: ${(next === null || next === void 0 ? void 0 : next.name) || "UNKNOWN"}, Previous stop: ${(prev === null || prev === void 0 ? void 0 : prev.name) || "UNKNOWN"}`;
                }
            }
        ]);
        money -= busPrice;
        if (moneyElement)
            moneyElement.textContent = money.toString();
        busPrice *= 1.3;
        if (priceElement)
            priceElement.textContent = money.toString();
        return true;
    }
    return false;
};
const addButton = document.getElementById("add");
const earn = document.getElementById("earn");
earn === null || earn === void 0 ? void 0 : earn.addEventListener("click", () => {
    const moneyElement = document.getElementById("money");
    money++;
    if (moneyElement)
        moneyElement.textContent = money.toString();
});
addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener('click', () => {
    const content = document.getElementById("content");
    const dialog = document.getElementById("add-bus");
    const add = document.getElementById("add-new-bus");
    const close = document.getElementById("add-bus-close");
    content === null || content === void 0 ? void 0 : content.setAttribute("class", "blur");
    dialog.showModal();
    add === null || add === void 0 ? void 0 : add.addEventListener('click', () => {
        if (addNewBus()) {
            content === null || content === void 0 ? void 0 : content.setAttribute("class", "noblur");
            dialog.close();
        }
    });
    close === null || close === void 0 ? void 0 : close.addEventListener('click', () => {
        content === null || content === void 0 ? void 0 : content.setAttribute("class", "noblur");
        dialog.close();
    });
});
