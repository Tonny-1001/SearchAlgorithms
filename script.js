const phrases = [
    "szybki brązowy lis",
    "czerwony samochód na parkingu",
    "zimowy wieczór przy kominku",
    "książka o sztuce nowoczesnej",
    "wakacje nad morzem",
    "przepis na ciasto czekoladowe",
    "muzyka relaksacyjna na wieczór",
    "podróż do egzotycznych krajów",
    "zielona herbata z cytryną",
    "film akcji z ulubionym aktorem",
    "poranna kawa z mlekiem",
    "spacer po parku wiosną",
    "nowe technologie w edukacji",
    "sztuka gotowania na parze",
    "zabawy dla dzieci w ogrodzie",
    "kreatywne pomysły na prezent",
    "wydarzenia kulturalne w mieście",
    "trening na świeżym powietrzu",
    "ogród pełen kwiatów",
    "cytaty motywacyjne na każdy dzień"
];

document.addEventListener("DOMContentLoaded", function () {
    for (let phrase of phrases) {
        for (let resultBox of document.querySelectorAll(".results")) {
            resultBox.innerHTML += `<p>${phrase}</p>`
        }

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

function termFrequency(term, doc) {
    // calculate TF
    let t_count = 0;
    let doc_words = doc.split(" ");
    for (let word of doc_words) {
        if (term == word) {
            t_count++;
        }
    }
    return t_count / doc_words.length;

}

function inverseDocumentFrequency(term, docs) {
    // calculate IDF
    let doc_count = docs.length;
    let docs_containing_term = 0;

    for (let doc of docs) {
        let doc_words = doc.split(" ")
        for (let word of doc_words) {
            if (word.toLowerCase() == term.toLowerCase()) {
                docs_containing_term++;
                break;
            }

        }
    }

    if (docs_containing_term != 0) {
        return doc_count / docs_containing_term;
    } else {
        return 0
    }

}

function search(query, list, algorithm) {
    if (algorithm == "levenshtein") {
        let calculatedDistances = []

        for (let elem of list) {
            similarity = 1 - levenshteinDistance(elem, query) / Math.max(elem.length, query.length)
            calculatedDistances.push({
                phrase: elem,
                similarity: similarity
            })
        }

        return calculatedDistances.sort((a, b) => b.similarity - a.similarity)
    } else if (algorithm == "tf-idf") {
        let calculatedScores = [];
        let lowerList = []
        query = query.toLowerCase()
        for (let elem of list) {
            lowerList.push(elem.toLowerCase())
        }

        for (let elem of lowerList) {
            similarity = 0
            for (let word of query.split(" ")) {
                similarity += termFrequency(word, elem) * inverseDocumentFrequency(word, lowerList)
            }

            calculatedScores.push({
                phrase: elem,
                similarity: similarity
            })
        }

        return calculatedScores.sort((a, b) => b.similarity - a.similarity)
    } else if (algorithm == "tf-idf-levenshtein") {
        let lowerList = [];
        let calculatedScores = [];

        for (let elem of list) {
            lowerList.push(elem.toLowerCase())
        }

        // creating known words dictionary
        let knownWords = [];
        for (let elem of lowerList) {
            for (let word of elem.split(" ")) {
                if (word.length > 2) {
                    knownWords.push(word)
                }
            }
        }

        for (let elem of lowerList) {
            similarity = 0;
            for (let word of query.split(" ")) {
                prevDistance = -1;
                correctWord = "";
                // checking what is the correct word
                for (let knownWord of knownWords) {
                    // starting distance
                    if (prevDistance == -1) {
                        prevDistance = levenshteinDistance(word, knownWord)
                        correctWord = knownWord
                    } else {
                        if (levenshteinDistance(word, knownWord) < prevDistance) {
                            prevDistance = levenshteinDistance(word, knownWord)
                            correctWord = knownWord
                        }
                    }
                }
                // calculating levenshtein distance with correct word
                similarity += termFrequency(correctWord, elem) * inverseDocumentFrequency(correctWord, lowerList)
            }

            calculatedScores.push({
                phrase: elem,
                similarity: similarity
            })
        }
        return calculatedScores.sort((a, b) => b.similarity - a.similarity)

    }

}

document.querySelector(".levenshtein .query").addEventListener("input", function () {
    document.querySelector(".levenshtein .results").innerHTML = ""

    for (let phrase of search(this.value, phrases, "levenshtein")) {
        document.querySelector(".levenshtein .results").innerHTML += `<p>${phrase.phrase} [${phrase.similarity}]</p>`
    }
})

document.querySelector(".tf-idf .query").addEventListener("input", function () {
    document.querySelector(".tf-idf .results").innerHTML = ""

    for (let phrase of search(this.value, phrases, "tf-idf")) {
        document.querySelector(".tf-idf .results").innerHTML += `<p>${phrase.phrase} [${phrase.similarity}]</p>`
    }
})

document.querySelector(".tf-idf-levenshtein .query").addEventListener("input", function () {
    document.querySelector(".tf-idf-levenshtein .results").innerHTML = ""

    for (let phrase of search(this.value, phrases, "tf-idf-levenshtein")) {
        document.querySelector(".tf-idf-levenshtein .results").innerHTML += `<p>${phrase.phrase} [${phrase.similarity}]</p>`
    }
})