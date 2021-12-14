import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

export function LiveChoice({ question, choiceClass, answeredState, answeredCountDocState, correctState, choicesState, timeState, summaryState }) {
    const ref = useRef()
    const { state } = useLocation()

    const [, setAnswered ] = answeredState
    const [ correct, setCorrect ] = correctState
    const [choices, setChoices] = choicesState
    const [, setQuizSummary ] = summaryState
    const [incrementAnsweredCountDoc] = answeredCountDocState

    useEffect(() => setChoices(choices => ({...choices, [choiceClass]: ref})), [])

    useEffect(() => {if (question && question.choices[choiceClass] === question.correctAnswer) setCorrect(choiceClass)}, [choiceClass, question, setCorrect])

    // Adjusts text size based on string length.
    useEffect(() => {
        if (question) {
            const text = question.choices[choiceClass]
            if (text) {
                if (text.length >= 30) {
                    ref.current.style.fontSize = "4vmin"
                } else if (text.length < 30 && text.length >= 15 ) {
                    ref.current.style.fontSize = "4.5vmin"
                } else {
                    ref.current.style.fontSize = "7vmin"
                }
            }
        }
    }, [choiceClass, question])

    /**
     * Answers and scores question.
     */
    function scoreChoice() {
        // const [ timeLeft ] = timeState
        // const timeFactor = timeLeft / state.initialTime
        //
        // let points
        // if (question.difficulty === 'hard') {
        //     points = Math.floor(20 + (15 * timeFactor))
        // } else if (question.difficulty === 'medium') {
        //     points = Math.floor(15 + (15 * timeFactor))
        // } else {
        //     points = Math.floor(10 + (15 * timeFactor))
        // }
        return 10
    }

    function choiceHandler() {
        incrementAnsweredCountDoc()
        setAnswered(true)
        if (choiceClass === correct) {
            ref.current.className = choiceClass + " current"
            ref.current.style.pointerEvents = 'none'

            choices.forEach(choice => {
                choices[choice].current.disabled = true
                if (choice !== choiceClass) choices[choice].current.className = choiceClass + " other"
            })

            const points = scoreChoice()
            setQuizSummary(quizSummary => ({...quizSummary,
                points: quizSummary.points + points,
                correctCount: quizSummary.correctCount + 1,
                totalCount: quizSummary.totalCount + 1
            }))
        }
        else {
            for (let choice in choices) {
                if (choice !== correct && choice !== choiceClass) {
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " other"
                } else if (choice === choiceClass){
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " incorrect-choice"
                } else {
                    choices[choice].current.className = choiceClass + " current"
                }
            }
            setQuizSummary(quizSummary => ({...quizSummary,
                incorrectCount: quizSummary.incorrectCount + 1,
                totalCount: quizSummary.totalCount + 1
            }))
        }
    }

    return (
        <button ref={ref} onClick={choiceHandler} className={choiceClass}>{question? question.choices[choiceClass] : ""}</button>
    )
}