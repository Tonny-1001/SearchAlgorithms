const phrases = [
    "Szybki brązowy lis",
    "Czerwony samochód na parkingu",
    "Zimowy wieczór przy kominku",
    "Książka o sztuce nowoczesnej",
    "Wakacje nad morzem",
    "Przepis na ciasto czekoladowe",
    "Muzyka relaksacyjna na wieczór",
    "Podróż do egzotycznych krajów",
    "Zielona herbata z cytryną",
    "Film akcji z ulubionym aktorem",
    "Poranna kawa z mlekiem",
    "Spacer po parku wiosną",
    "Nowe technologie w edukacji",
    "Sztuka gotowania na parze",
    "Zabawy dla dzieci w ogrodzie",
    "Kreatywne pomysły na prezent",
    "Wydarzenia kulturalne w mieście",
    "Trening na świeżym powietrzu",
    "Ogród pełen kwiatów",
    "Cytaty motywacyjne na każdy dzień"
];

// const phrases = ["/test", "/kot", "/pies", "/ciasto", "/pierogi"]

document.addEventListener("DOMContentLoaded", function () {
    for (let phrase of phrases) {
        document.getElementById("results").innerHTML += `<p>${phrase}</p>`
    }
})

function levenshteinDistance(a, b) {
    let matrix = [];

    // creating matrix based on a,b length
    for (let x = 0; x < a.length + 1; x++) {
        matrix.push([])
        for (let y = 0; y < b.length + 1; y++) {
            if (x == 0) {
                matrix[x].push(y)
            } else if (y == 0) {
                matrix[x].push(x)
            }
        }
    }

    // filling empty matrix
    for (let x = 1; x < matrix.length; x++) {
        for (let y = 1; y < matrix[0].length; y++) {
            let left = matrix[x - 1][y] + 1
            let above = matrix[x][y - 1] + 1
            let cross = matrix[x - 1][y - 1]
            let cost = 0

            if (a[x - 1] != b[y - 1]) {
                cost = 1
            }

            let final = Math.min(left, above, (cross + cost))
            matrix[x][y] = final
        }
    }


    return matrix[a.length][b.length]
}

function search(query, list, algorithm) {
    if (algorithm == "levenshtein") {
        let calculatedDistances = []

        for (let elem of list) {
            similarity = 1 - levenshteinDistance(elem, query) / Math.max(elem.length, query.length)
            calculatedDistances.push({
                "phrase": elem,
                "similarity": similarity
            })
        }

        return calculatedDistances.sort((a, b) => b.similarity - a.similarity)
    }

}

document.getElementById("query").addEventListener("input", function () {
    document.getElementById("results").innerHTML = ""

    for (let phrase of search(this.value, phrases, "levenshtein")) {
        document.getElementById("results").innerHTML += `<p>${phrase.phrase} [${phrase.similarity}]</p>`
    }
})