let currentPlayer = 'cross';
let winer = false;

let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let statistics = [
    {
        "winCross": 0,
        "winCircle": 0,
        "push": 0
    }
]

function init() {
    render();
    rendergameInfo();
}

function rendergameInfo() {
    const gameInfo = document.getElementById('gameInfo')
    gameInfo.innerHTML = statistic();
}

function render() {
    let boardHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        boardHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';

            if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            } else if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            }
            boardHtml += `<td onclick="handleClick(this,${index});  toggleGray()">${symbol}</td>`;
        }
        boardHtml += '</tr>';
    }
    boardHtml += '</table>';
    document.getElementById("gameContent").innerHTML = boardHtml;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';

        const winningCombination = checkWinner();
        if (winningCombination) {
            drawWinningLine(winningCombination);
            winer = true;
            return; // Beendet die Funktion, um keinen weiteren Zug zuzulassen
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Spalten
        [0, 4, 8], [2, 4, 6]             // Diagonalen
    ];

    return winningCombinations.find(([a, b, c]) =>
        fields[a] && fields[a] === fields[b] && fields[a] === fields[c]
    ) || null;
}


function drawWinningLine(combination) {
    const cells = document.querySelectorAll("td");
    const rects = combination.map(index => cells[index].getBoundingClientRect());

    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = "white";
    line.style.height = "5px";
    line.style.borderRadius = "5px";
    line.style.zIndex = "10";

    const startX = rects[0].left + window.scrollX + rects[0].width / 2;
    const startY = rects[0].top + window.scrollY + rects[0].height / 2;
    const endX = rects[2].left + window.scrollX + rects[2].width / 2;
    const endY = rects[2].top + window.scrollY + rects[2].height / 2;

    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    line.style.width = `${distance}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = `top left`
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;

    document.getElementById("gameContent").appendChild(line);
}

function restart() {
    fields = [null, null, null, null, null, null, null, null, null,];
    document.getElementById('x').classList.remove('grayscale');
    document.getElementById('o').classList.add('grayscale');
    currentPlayer = 'cross';
    init();
    counter();
    winer = false;
}


function generateCircleSVG() {
    return `
        <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(0,176,240)" stroke-width="5">
                <animate attributeName="stroke-dasharray" from="0, 251.2" to="251.2, 0" dur="0.6s" fill="freeze"/>
                <animate attributeName="stroke-dashoffset" from="0" to="251.2" dur="0.6s" fill="freeze"/>
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
                <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="20" x2="80" y2="80" stroke="rgb(255,192,0)" stroke-width="8" stroke-linecap="round">
                        <animate attributeName="x2" from="20" to="80" dur="0.3s" fill="freeze"/>
                        <animate attributeName="y2" from="20" to="80" dur="0.3s" fill="freeze"/>
                    </line>
                    <line x1="80" y1="20" x2="20" y2="80" stroke="rgb(255,192,0)" stroke-width="8" stroke-linecap="round">
                        <animate attributeName="x2" from="80" to="20" dur="0.3s" fill="freeze"/>
                        <animate attributeName="y2" from="20" to="80" dur="0.3s" fill="freeze"/>
                    </line>
                </svg>
            `;
}

function counter() {
    if (winer === true) {
        switch (currentPlayer) {
            case 'cross':
                statistics[0].winCircle = statistics[0].winCircle + 1
                break;
            case 'circle':
                statistics[0].winCross = statistics[0].winCross + 1
                break;
        }
    } if (winer === false) {
        statistics[0].push = statistics[0].push + 1
    }
    rendergameInfo()
}

function statistic() {
    return `
    <img class="icon-size" src="./img/icon/icons8-x-64.png">
    <span>${statistics[0].winCross}</span>
    <img class="icon-size" src="./img/icon/icons8-ausgefüllter-kreis-96.png">
    <span>${statistics[0].winCircle}</span>
    <img class="icon-size" src="./img/icon/icons8-handshake-96.png">
    <span>${statistics[0].push}</span>`
}


function toggleGray() {
    document.getElementById('x').classList.toggle('grayscale')
    document.getElementById('o').classList.toggle('grayscale')

}