/**
 * Decodes input from API.
 * @param input String from API response.
 * @returns {string}
 */
function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

/**
 * Shuffles an array.
 * @param array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/**
 * An Object to store the information to display a multiple choice question.
 */
export class BucketMCQ {
    constructor({ question, category, difficulty, correct_answer, incorrect_answers }) {
        this.question = htmlDecode(question)
        this.category = category
        this.difficulty = difficulty

        const allChoices = [htmlDecode(correct_answer)]
        incorrect_answers.forEach(answer => {
            allChoices.push(htmlDecode(answer))
        })
        this.correctAnswer = allChoices[0]
        shuffleArray(allChoices)
        this.choices = {
            A: allChoices[0],
            B: allChoices[1],
            C: allChoices[2],
            D: allChoices[3]
        }
    }
}