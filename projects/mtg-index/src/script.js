let firstDeckNr = 1;
let fetchedData;
async function getData() {
    const url = `https://docs.google.com/spreadsheets/d/1epeuYV1FmJpVYUr30DVS8bPJ254rxmYtGfl3eooZm9M/gviz/tq?tqx=out:json&tq&gid=1153682861`;
    try {
        const req = await fetch(url);
        fetchedData = JSON.parse((await req.text()).substring(47).slice(0, -2));
        render();
    }
    catch (error) {
        console.error(error.message);
    }
}
function render() {
    const tableData = transformJson(fetchedData);
    console.log(tableData);
    document.getElementById('my-table').innerHTML = "";
    tableData.map(rowData => {
        const el = document.createElement("tr");
        el.innerHTML = buildRowHtml(rowData);
        document.getElementById('my-table').appendChild(el);
    });
}
function renderPage(page) {
    firstDeckNr = 18 * (page - 1) + 1;
    this.render();
}
function transformJson(json) {
    return json.table.rows.slice(firstDeckNr - 1, firstDeckNr + 17).map(createDeckData);
}
main();
async function main() {
    getData();
}
function createDeckData(row) {
    return {
        nr: row.c[1].f,
        farben: row.c[3].v,
        schwierigkeit: row.c[4].v,
        spieldauer: row.c[5].v,
        siegesbedingung: row.c[6].v,
        setname: row.c[7]?.v,
        kartentypen: row.c[8]?.v,
        kreaturentypen: row.c[9]?.v,
        kategorien: row.c[10]?.v,
    };
}
function createChipsData(row) {
    const chips = [];
    if (row.c[7]?.v) {
        chips.push({
            value: row.c[7].v,
            type: "set"
        });
    }
    if (row.c[8]?.v) {
        row.c[8].v.split(',').forEach(v => chips.push({
            value: v,
            type: "cardType"
        }));
    }
    if (row.c[9]?.v) {
        row.c[9].v.split(',').forEach(v => chips.push({
            value: v,
            type: "creatureType"
        }));
    }
    if (row.c[10]?.v) {
        row.c[10].v.split(',').forEach(v => chips.push({
            value: v,
            type: "category"
        }));
    }
    return chips;
}
function buildRowHtml(deckData) {
    return `<td class="nr">${deckData.nr}</td>`
        + `<td class="image">${getImageHtml(deckData.nr)}</td>`
        + `<td class="mana">${getManaHtml(deckData.farben)}</td>`
        + `<td class="difficulty">${getDifficultyHtml(deckData.schwierigkeit)}</td>`
        + `<td class="duration">${getDurationHtml(deckData.spieldauer)}</td>`
        + `<td class="win-condition">${getWinconHtml(deckData.siegesbedingung)}</td>` // todo
        + `<td class="tags">${getTagsHtml(deckData)}</td>`;
}
const manaSymbols = {
    "W": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/W.svg",
    "U": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/U.svg",
    "G": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/G.svg",
    "R": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/R.svg",
    "B": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/B.svg",
    "C": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/C.svg"
};
function getManaHtml(manaString) {
    let result = "";
    if (manaString.length > 3) {
        const firstRowLetters = manaString.slice(0, manaString.length / 2);
        const firstRowClass = manaString.length === 4 ? "lefty" : "";
        const secondRowLetters = manaString.slice(manaString.length / 2);
        const secondRowClass = manaString.length === 4 ? "righty" : "";
        return createManaSymbolRowHtml(firstRowLetters, firstRowClass) + createManaSymbolRowHtml(secondRowLetters, secondRowClass);
    }
    else {
        for (const letter of manaString) {
            result += getManaSymbolHtml(letter);
        }
        return result;
    }
}
function createManaSymbolRowHtml(manaString, className = "") {
    let manaSymbolsHtml = "";
    for (const letter of manaString) {
        manaSymbolsHtml += getManaSymbolHtml(letter);
    }
    return '<div class="mana-symbol-row ' + className + '">' + manaSymbolsHtml + '</div>';
}
function getManaSymbolHtml(manaLetter) {
    return `<img class="mana-symbol" src="${manaSymbols[manaLetter]}"/>`;
}
function getImageHtml(nr) {
    let fileName = String(nr);
    if (nr < 10) {
        fileName = "00" + nr;
    }
    else if (nr < 100) {
        fileName = "0" + nr;
    }
    return `<img src="https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/deck-images-only/${fileName}.png"></img>`;
}
function getDifficultyHtml(difficulty) {
    let starHtml;
    let difficultyCss;
    let difficultyLabel;
    switch (difficulty) {
        case "Leicht":
            difficultyLabel = "EASY";
            starHtml = "★";
            difficultyCss = "difficulty-easy";
            break;
        case "Mittel":
            difficultyLabel = "MEDIUM";
            starHtml = "★★";
            difficultyCss = "difficulty-medium";
            break;
        case "Schwer":
            difficultyLabel = "HARD";
            starHtml = "★★★";
            difficultyCss = "difficulty-hard";
            break;
        case "Extrem":
            difficultyLabel = "EXTREM";
            starHtml = "★★★★";
            difficultyCss = "difficulty-extrem";
            break;
    }
    return `<div class='difficulty-icon ${difficultyCss}'>
<div class="difficulty-label">${difficultyLabel}</div>
<div class="difficulty-stars">${starHtml}</div>
</div>`;
}
const durationImagePaths = {
    Schnell: "clock1.png",
    Mittel: "clock2.png",
    Langsam: "clock3.png",
    Endlos: "clock4.png",
};
function getDurationHtml(duration) {
    return `<img class="clock" src="https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/clock/${durationImagePaths[duration]}"/>`;
}
function htmlChip(text, className) {
    if (!text) {
        return "";
    }
    let htmlIcon = "";
    if (className === "chip-set") {
        htmlIcon = `<img class="chip-icon" src="${getImagePathRpgIcon("rising-sun")}"/>`;
    }
    return `<div class="chip ${className}">${htmlIcon}${text}</div>`;
}
function getImagePathRpgIcon(rpgIcon) {
    return `https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/rpg-icons/${rpgIcon}.png`;
}
function htmlSet(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-set')).join('') : "";
}
function htmlCardType(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-card')).join('') : "";
}
function htmlCreatureType(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-creature')).join('') : "";
}
function htmlCategories(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-category')).join('') : "";
}
function getTagsHtml(item) {
    return `<div class="chips-container">${htmlSet(item.setname)}${htmlCardType(item.kartentypen)}${htmlCreatureType(item.kreaturentypen)}${htmlCategories(item.kategorien)}</div>`;
}
function getWinconHtml(siegesbedingung) {
    switch (siegesbedingung) {
        case "Beatdown":
            return beatdownHtml;
        default:
            return "";
    }
}
const beatdownHtml = 'todo';
