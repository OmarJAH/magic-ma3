const page = 6; // CHANGE THIS VALUE FOR NEW PAGES - Every page gets automatically the right page name and the 36 x 2 decks on 2 pages
const startIndex = 72 * (page - 1);
const pageNames = [
		'Alpha',
		'Beta',
		'Gamma',
		'Delta',
		'Epsilon',
		'Zeta',
		'Eta',
		'Theta'
];
const pageName = pageNames[page - 1];

function titles() {
		document.getElementById('title1').append(pageName + " I");
		document.getElementById('title2').append(pageName + " II");
}

titles();

function htmlNumber(number) {
		return `<td class="center" style="width: 50px;">${number}</td>`;
}

// todo - make a function that takes the color letter as argument and returns the right URL for the SVG
// todo - change SVG URL with our own hosted versions (mana-symbols folder in resources folder) once we have it public on github
const manaSymbols = {
		"W": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/8e/W.svg",
		"U": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/9/9f/U.svg",
		"G": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/88/G.svg",
		"R": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/87/R.svg",
		"B": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/2/2f/B.svg",
		"C": "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/1/1a/C.svg"
}

function htmlMana(manaString) {
		let result = ""
		for (const letter of manaString) {
				result += `<img class="mana" src="${manaSymbols[letter]}"/>`;
		}
		return `<td class="center" style="width: 80px; min-width: 80px;">${result}</td>`;
}

function htmlDifficulty(difficultyString) {
		return `<td class="center" style="width: 60px"><div class="diff ${difficultyString.toLowerCase()}"><div></div><div></div><div></div><div></div></div></td>`;
}

const durationImagePaths = {
		"schnell": "clock1.png",
		"mittel": "clock2.png",
		"langsam": "clock3.png",
		"endlos": "clock4.png",
}

function htmlDuration(durationString) {
		// todo - the current url for asset images is from an online html editor, we should change this once we have public url for those images in GitHub (clock folder in resources folder)
		return `<td class="center" style="width: 40px;"><img class="clock" src="https://assets.onecompiler.app/42y75gju6/42y75asmz/${durationImagePaths[durationString]}"/></td>`;
}

function htmlChip(text, className) {
		if (!text) {
				return ""
		}
		return `<div class="chip ${className}">${text}</div>`;
}

function htmlVictory(victoryString) {
		return `<td class="center" style="width: 50px;">${htmlChip(victoryString, 'chip-victory')}</td>`;
}

function htmlSet(string) {
		return string.split(',').map(s => htmlChip(s, 'chip-set')).join('');
}

function htmlCardType(string) {
		return string.split(',').map(s => htmlChip(s, 'chip-card')).join('');
}

function htmlCreatureType(string) {
		return string.split(',').map(s => htmlChip(s, 'chip-creature')).join('');
}

function htmlCategories(string) {
		return string.split(',').map(s => htmlChip(s, 'chip-category')).join('');
}


function htmlText(item) {
		return `<td class="center">${htmlSet(item.Setname)}${htmlCardType(item.Kartentypen)}${htmlCreatureType(item.Kreaturentypen)}${htmlCategories(item.Kategorien)}</td>`;
}

function createRowForItem(item) {
		const htmlString = htmlNumber(item.Nr) + htmlMana(item.Farben) + htmlDifficulty(item.Schwierigkeit) + htmlDuration(item.Spieldauer.toLowerCase()) + htmlVictory(item.Siegesbedingung) + htmlText(item);
		const newRow = document.createElement('tr');
		newRow.innerHTML = htmlString.trim();
		return newRow;
}

for (const item of data.slice(startIndex + 0, startIndex + 36)) {
		document.getElementById('table1').append(createRowForItem(item));
}
for (const item of data.slice(startIndex + 36, startIndex + 72)) {
		document.getElementById('table2').append(createRowForItem(item));
}


