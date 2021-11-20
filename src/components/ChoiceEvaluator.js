import {useRef} from "react";

/**
 * The button to check a choice and move to the next question.
 */
export function ChoiceEvaluator(props) {
    const { indx, curr, answer, usrAnswrs, rnning, scre } = props
    const { running, setRunning } = rnning
    const { score, setScore } = scre
    const ref = useRef()

    const { index, setIndex, n } = indx
    const { currentChoice, setCurrentChoice } = curr
    const { userAnswers, setUserAnswers } = usrAnswrs

    // Moves to next question or ends quiz if last question has been answered.
    function nextQuestion() {
        if (index + 1 < n) {
            setIndex(index => index + 1)
            setCurrentChoice(null)
        } else {
            if (running) {
                setRunning(false)
            }
        }
    }

    // Compares the current choice to the question answer, and scores
    function handler() {
        let correct
        if (!currentChoice) {
            console.log("No answer selected.")
            correct = null
        } else if (currentChoice.current.innerHTML === answer) {
            console.log("Correct answer.")
            correct = true
            setUserAnswers([...userAnswers, true])
            setScore(score => score + 1)
        } else {
            console.log("Incorrect answer.")
            correct = false
            setUserAnswers([...userAnswers, false])
        }
        if (correct != null) {
            nextQuestion()
        }
    }

    return (
        <button ref={ref} onClick={handler} className={"check"}/>
    )
}