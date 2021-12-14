import {useEffect, useRef} from "react";

/**
 * The Multiple Choice Question Choice component.
 * @returns {JSX.Element}
 */
export function Choice({ question, choiceClass, answeredState, correctState, choicesState, timeState, summaryState }) {
    const ref = useRef()

    const [, setAnswered ] = answeredState
    const [ correct, setCorrect ] = correctState
    const [choices, setChoices] = choicesState
    const [, setQuizSummary ] = summaryState

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
        debugger

        let points
        if (question.difficulty === 'hard') {
            points = Math.floor(20)
        } else if (question.difficulty === 'medium') {
            points = Math.floor(15)
        } else {
            points = Math.floor(10)
        }
        return points
    }

    function choiceHandler() {
        setAnswered(true)
        if (choiceClass === correct) {
            ref.current.className = choiceClass + " current"
            for (let choice in choices) {
                if (choice !== choiceClass) {
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " other"
                }
            }
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