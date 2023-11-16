"use strict";
const find = function (selector) {
    return Array.from(document.querySelectorAll(selector))[1];
};
let count = 0;
const moneyElement = find("#money");
const earnElement = find("#earn");
earnElement.onclick = (e) => {
    e.preventDefault();
    count++;
    earnElement.textContent = `${count}`;
};
