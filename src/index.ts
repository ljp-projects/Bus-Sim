const find = function <Type>(selector: string): Type {
    return Array.from(document.querySelectorAll(selector))[0] as Type;
};

interface MutableStat<T> {
    lastChanged: number;
    value: T;
    set?: (value: T) => any;
    add?: (value: T) => any;
    take?: (value: T) => any;
}

interface ImmutableStat<T> {
    readonly created: number;
    readonly value: T;
}

const Player = {
    /**
     * The players bus lines.
     * [NAME, ID]
     */
    Lines: {
        created: new Date().getTime(),
        value: [],
    } as ImmutableStat<[string, [number, number]][]>,
};

const Game = {
    Money: {
        lastChanged: new Date().getTime(),
        value: 0,

        set: (...params: number[]) => {
            const amount: number = params[0] || 0;
            Game.Money.value = amount;
            Game.Money.lastChanged = new Date().getTime();
        },

        add: (...params: number[]) => {
            const amount: number = params[0] || 0;
            Game.Money.value += amount;
            Game.Money.lastChanged = new Date().getTime();
        },

        take: (...params: number[]) => {
            const amount: number = params[0] || 0;
            Game.Money.value -= amount;
            Game.Money.lastChanged = new Date().getTime();
        },
    } as MutableStat<number>,

    Increment: {
        created: new Date().getTime(),
        value: 1.3,
    } as ImmutableStat<number>,

    Update: {
        created: new Date().getTime(),
        value: (frequencyMilli: number) => {
            setInterval(() => {
                moneyElement.textContent = `${Game.Money.value}`;
            }, frequencyMilli);
        },
    } as ImmutableStat<(frequencyMilli: number) => void>,

    GenerateEvent: {
        created: new Date().getTime(),
        value: (): number => [0, 1, 2, 2, 0, 0, 0, 0, 2, 2, 1, 0, 0, 0, 2, 1, 0, 2, 2, 0][~~(Math.random() * 20)],
    } as ImmutableStat<() => number>,
};

const moneyElement = find<HTMLElement>("#money");
const earnElement = find<HTMLElement>("#earn");
const linesElement = find<HTMLElement>("#lines");
const addLineElement = find<HTMLElement>("#line");

earnElement?.addEventListener("click", () => {
    if (Game.Money.add) Game.Money.add(1);
});

addLineElement?.addEventListener("click", () => {
    if (Game.Money.value >= 100) {
        const name: string =
            prompt("What shall the name of the line be?") || "BUS LINE NAME";
        const id: number = new Date().getTime() || 0;
        let passengers = ~~(Math.random() * (Player.Lines.value.length * 5));
        const generatedLine: [string, [number, number]] = [name, [id, passengers]];
        const generatedHTMLLine = `
        <li style="list-style: none;" id="BUS-LINE-${id}">
            <b id="BUS-LINE-${id}-NAME">${name}</b>
            <p id="BUS-LINE-${id}-ID">${id}</p>
            <p>Per second: $<span id="BUS-LINE-${id}-PROFIT">${passengers * 0.5 + Player.Lines.value.length
            }</span></p>
        </li>
        `;

        const earnLoop = () => {
            const event = Game.GenerateEvent.value();
            if (Game.Money.add && event === 0) {
                Game.Money.add(passengers * 0.5 + Player.Lines.value.length);
                setTimeout(earnLoop, 1e3)
            } else {
                switch (event) {
                    // Bus breaks down
                    case 1:
                        alert(`Your bus '${name}(${id})' broke down!`);
                        setTimeout(earnLoop, 1e4);
                        break;
                    case 2:
                        const fuelPrice = Math.min(`${name}`.length, Player.Lines.value.length * 2)
                        if (fuelPrice <= Game.Money.value) {
                            alert(`Your bus '${name}(${id})' is out of fuel! Paying to refuel...`)
                            if (Game.Money.take) Game.Money.take(fuelPrice)
                            setTimeout(earnLoop, 2e3 + 5e2);
                        };
                        break;
                }
            }
        };

        earnLoop()

        const board = setInterval(() => {
            passengers = ~~(Math.random() * 10);
            find<HTMLElement>(`#BUS-LINE-${id}-PROFIT`).textContent = `${passengers * 0.5 + Player.Lines.value.length
                }`;
        }, 5000);

        Player.Lines.value.push(generatedLine);
        linesElement.innerHTML += generatedHTMLLine;
        if (Game.Money.take) Game.Money.take(100);
    } else {
        alert(`You need more money.`);
    }
});

Game.Update.value(50);
