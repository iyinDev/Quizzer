import fetch from "cross-fetch";

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function unpackResponse(response) {
    if ( response.response_code === 0 ) {
        // successful query
        let responseQuestions = []
        response.results.forEach(question => {
            let mcq = new MultipleChoiceQuestionBucket(question)
            responseQuestions.push(mcq)
        })
        return responseQuestions
    } else if ( response.response_code === 1 ) {
        // not enough results for query
    }
}


export async function getQuestions(props) {
    const {n, category, difficulty, type} = props

    const skeleton = "https://opentdb.com/api.php?"
    const AND = "&"

    const qAmount = "amount=" + n
    const qCategory = category ? AND + "category=" + category : null
    const qDifficulty = difficulty ? AND + "difficulty=" + difficulty : null
    const qType = type ? AND + "type=" + type : null

    const query = skeleton + qAmount
        + (qCategory ? qCategory : "")
        + (qDifficulty ? qDifficulty : "")
        + (qType ? qType : "")

    const response = await fetch(query)
    const data = await response.json()

    const questions = unpackResponse(data)
    return questions
}

export function getCategories() {
    const query = "https://opentdb.com/api_category.php"
    fetch(query).then(value => value.json()).then(data => console.log(data))
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
// export class Quiz {
//     constructor(questions) {
//         this.questions = questions
//     }
// }
//
export class MultipleChoiceQuestionBucket {
    constructor(props) {
        const { question, category, difficulty, correct_answer, incorrect_answers } = props
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

