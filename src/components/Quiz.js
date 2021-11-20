import {useEffect, useState} from "react";
import {useFetch} from "use-http";
import {MultipleChoiceQuestion} from "./Question";
import {MultipleChoiceQuestionBucket} from "../services/quiz";
import {Results} from "./Results";
import {Score} from "./Score";

/**
 *
 * @param props An Array of MultipleChoiceQuestion Objects
 * @constructor
 */
export function Quiz(props) {
    const { amount, category, difficulty, type } = props
    const { get, response } = useFetch('https://opentdb.com')

    const [ questions, setQuestions ] = useState([])
    const [ userAnswers, setUserAnswers ] = useState([]), usrAnswrs = {userAnswers: userAnswers, setUserAnswers: setUserAnswers}
    const [ index, setIndex ] = useState(0), indx = {index: index, setIndex: setIndex, n: amount}
    const [ score, setScore ] = useState(0), scre = {score: score, setScore: setScore}

    async function initializeQuiz() {
        const skeleton = '/api.php?'
        const qR = await get(
            skeleton
            + (amount? "&amount=" + amount : "")
            + (category? "&category=" + category : "")
            + (difficulty? "&difficulty=" + difficulty : "")
            + (type? "&type=" + type : "")
        )

        if (response.ok) {
            let responseQuestions = []
            qR.results.forEach(question => {
                let mcq = new MultipleChoiceQuestionBucket(question)
                responseQuestions.push(mcq)
            })
            setQuestions(responseQuestions)
        }
    }

    // Makes API GET request to initialize quiz questions
    useEffect(() => {initializeQuiz()}, [])

    useEffect(() => {
        if (userAnswers) {
            console.log('User answers. -> ' + userAnswers)
        }
    }, [userAnswers])

    return (
        <div>
            <Results usrAnswrs={usrAnswrs} index={indx}/>
            <div className={"quiz"}>
                <Score scre={scre}/>
                <span className={"logo"}>QUIZZER!</span>
                <MultipleChoiceQuestion mcq={questions[index]} usrAnswrs={usrAnswrs} indx={indx} scre={scre}/>
            </div>
        </div>

    )
}