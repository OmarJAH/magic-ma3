type Difficulty = "Leicht" | "Mittel" | "Schwer" | "Extrem"
type Duration = "Schnell" | "Mittel" | "Langsam" | "Endlos"
type WinCondition = "Beatdown" | "Lifedrain" | "Spellslinger" | "Wincon" | "Support" | "Mill" | "Toxic"

type DeckData = {
    nr: number
    farben: string
    schwierigkeit: Difficulty,
    spieldauer: Duration,
    siegesbedingung: WinCondition,
    setname?: string,
    kartentypen?: string,
    kreaturentypen?: string,
    kategorien?: string,
    chips: {
        value: string,
        type: "set" | "cardType" | "creatureType" | "category"
    }[]
}

const firstDeckNr = 1

async function getData() {
    const url = `https://docs.google.com/spreadsheets/d/1epeuYV1FmJpVYUr30DVS8bPJ254rxmYtGfl3eooZm9M/gviz/tq?tqx=out:json&tq&gid=1153682861`;
    try {
        const req = await fetch(url)
        const json = JSON.parse((await req.text()).substring(47).slice(0, -2))
        const sixBoxesData = transformJson(json)
        console.log(sixBoxesData)
        sixBoxesData.slice(0, 3).map(sixBox => {
            const el = document.createElement("div");
            el.innerHTML = buildSixBox(sixBox);
            document.getElementById('table1').appendChild(el.firstChild);
        })
        sixBoxesData.slice(3, 6).map(sixBox => {
            const el = document.createElement("div");
            el.innerHTML = buildSixBox(sixBox);
            document.getElementById('table2').appendChild(el.firstChild);
        })
    } catch (error: any) {
        console.error(error.message);
    }
}

function transformJson(json: any) {
    return transformIntoSixBoxes(json.table.rows.slice(firstDeckNr - 1, firstDeckNr + 35).map(createDeckData))
}

function transformIntoSixBoxes(deckData: DeckData[]) {
    const perChunk = 6 // items per chunk
    return deckData.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
}

main()

async function main(): Promise<void> {
    getData()
}

function createDeckData(row: any) {
    return {
        nr: row.c[1].f,
        farben: row.c[3].v,
        schwierigkeit: row.c[1].f == 5 ? "Extrem" : row.c[4].v,
        spieldauer: row.c[5].v,
        siegesbedingung: row.c[6].v,
        setname: row.c[7]?.v,
        kartentypen: row.c[8]?.v,
        kreaturentypen: row.c[9]?.v,
        kategorien: row.c[10]?.v,
    } as DeckData
}

function createChipsData(row: any) {
    const chips: {
        value: string,
        type: "set" | "cardType" | "creatureType" | "category"
    }[] = [];
    if (row.c[7]?.v) {
        chips.push({
            value: row.c[7].v,
            type: "set"
        })
    }
    if (row.c[8]?.v) {
        row.c[8].v.split(',').forEach(v => chips.push({
            value: v,
            type: "cardType"
        }))
    }
    if (row.c[9]?.v) {
        row.c[9].v.split(',').forEach(v => chips.push({
            value: v,
            type: "creatureType"
        }))
    }
    if (row.c[10]?.v) {
        row.c[10].v.split(',').forEach(v => chips.push({
            value: v,
            type: "category"
        }))
    }
    return chips;

}

function buildSixBox(deckData: DeckData[]) {
    return `<div class="six-box">
<div class="first-row">${deckData.slice(0, 3).map(buildSingleBox).join("")}</div>
<div class="second-row">${deckData.slice(3, 6).map(buildSingleBox).join("")}</div></div>`
}

function buildSingleBox(deckData: DeckData) {
    return `<div class="single-box">
<div class="left-col">
    <div class="image">${getImageHtml(deckData.nr)}</div>
    <div class="mana">${getManaHtml(deckData.farben)}</div>
    <div class="nr">${deckData.nr}</div>
</div>
<div class="right-col">
  <div class="right-col-icons">
    <div class="difficulty">${getDifficultyHtml(deckData.schwierigkeit)}</div>
    <div class="duration">${getDurationHtml(deckData.spieldauer)}</div>
  </div>
    <div class="win-condition">${deckData.siegesbedingung}</div>
    ${getTagsHtml(deckData)}
</div>
</div>`
}

const manaSymbols = {
    "W": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/W.svg",
    "U": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/U.svg",
    "G": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/G.svg",
    "R": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/R.svg",
    "B": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/B.svg",
    "C": "https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/mana-symbols/C.svg"
}

function getManaHtml(manaString: string) {
    let result = ""
    for (const letter of manaString) {
        result += `<img class="mana-symbol" src="${manaSymbols[letter]}"/>`;
    }
    return result;
}

function getImageHtml(nr: number) {
    let fileName = String(nr);
    if (nr < 10) {
        fileName = "00" + nr;
    } else if (nr < 100) {
        fileName = "0" + nr;
    }
    return `<img src="https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/deck-images-only/${fileName}.png"></img>`
}


function getDifficultyHtml(difficulty: Difficulty) {
    let starHtml: string;
    let difficultyCss: string;
    let difficultyLabel: string;
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
</div>`
}

const durationImagePaths: Record<Duration, string> = {
    Schnell: "clock1.png",
    Mittel: "clock2.png",
    Langsam: "clock3.png",
    Endlos: "clock4.png",
}

function getDurationHtml(duration: Duration) {
    return `<img class="clock" src="https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/assets/clock/${durationImagePaths[duration]}"/>`;
}

function htmlChip(text, className) {
    if (!text) {
        return ""
    }
    return `<div class="chip ${className}">${text}</div>`;
}

function htmlSet(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-set')).join('') : "";
}

function htmlCardType(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-card')).join('') : "";
}

function htmlCreatureType(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-creature')).join(''): "";
}

function htmlCategories(string) {
    return string ? string.split(',').map(s => htmlChip(s, 'chip-category')).join(''): "";
}


function getTagsHtml(item: DeckData) {
    return `<div class="chips-container">${htmlSet(item.setname)}${htmlCardType(item.kartentypen)}${htmlCreatureType(item.kreaturentypen)}${htmlCategories(item.kategorien)}</div>`;
}

