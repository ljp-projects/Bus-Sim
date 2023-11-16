"use strict";
const find = function (selector) {
    return Array.from(document.querySelectorAll(selector))[0];
};
const Game = {
    Money: {
        lastChanged: new Date().getTime(),
        value: 0,
        set: (...params) => {
            const amount = params[0] || 0;
            Game.Money.value = amount;
            Game.Money.lastChanged = new Date().getTime();
        },
        add: (...params) => {
            const amount = params[0] || 0;
            Game.Money.value += amount;
            Game.Money.lastChanged = new Date().getTime();
        }
    },
    Increment: {
        created: new Date().getTime(),
        value: 1.3
    }
};
const moneyElement = find("#money");
const earnElement = find("#earn");
Game.Increment.value = 9;
console.log(Game.Increment.value);
earnElement === null || earnElement === void 0 ? void 0 : earnElement.addEventListener('click', () => {
    Game.Money.add(1);
    moneyElement.textContent = `${Game.Money.value}`;
});
