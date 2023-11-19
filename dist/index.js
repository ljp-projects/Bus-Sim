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
    removeRoute() {
        this.hasRoute = false;
        this.route = undefined;
        return this;
    }
    travel() {
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
                console.log(stop, next != null ? next : null, prev != null ? prev : null);
            else if (this.status === 9)
                console.log("Bus has broken down.");
            else if (this.status === 10)
                console.log("Bus is out of fuel.");
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
        <button id="BUS-${this.id}-CHECK">Check</button>
        `;
        const el = document.createElement('li');
        el.innerHTML = html;
        const button = document.getElementById(`BUS-${this.id}-CHECK`);
        button === null || button === void 0 ? void 0 : button.addEventListener('click', () => {
            const dialog = document.getElementById("about-bus");
            const html = `
            <h2>${this.name}</h2>
            <p>${this.status <= 8 ? "Normal" : this.status === 9 ? "Bus has broken down." : this.status === 10 ? "Bus is out of fuel" : "UNKOWN"}</p>
            <button id="BUS-${this.id}-CLOSE">Close</button>
            `;
            if (dialog) {
                dialog.innerHTML = html;
                dialog.showModal();
                const close = document.getElementById(`BUS-${this.id}-CLOSE`);
                close === null || close === void 0 ? void 0 : close.addEventListener('click', () => {
                    dialog.close();
                    dialog.innerHTML = "";
                });
            }
        });
        list === null || list === void 0 ? void 0 : list.appendChild(el);
        return this;
    }
}
const bus = new Bus('Pizza', new Date().getTime(), Routes.MakeRoute(5));
bus.addToList(document.getElementById("buses"));
