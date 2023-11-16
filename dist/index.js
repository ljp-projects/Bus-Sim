"use strict";
const find = function (selector) {
    return Array.from(document.querySelectorAll(selector))[0];
};
let count = 0;
const moneyElement = find("#money");
const earnElement = find("#earn");
earnElement === null || earnElement === void 0 ? void 0 : earnElement.addEventListener('click', () => {
    count++;
    earnElement.textContent = `${count}`;
});
