import {useRef} from "react";

export function Check(props) {
    const { index, curr, answer, usrAnswrs, rnning, scre } = props
    const { running, setRunning } = rnning
    const { score, setScore } = scre
    const ref = useRef()

    const { getIndex, setIndex, n } = index, indexVal = getIndex, setIndexVal = setIndex
    const { currentChoice, setCurrentChoice } = curr
    const { userAnswers, setUserAnswers } = usrAnswrs

    function nextQuestion() {
        if (indexVal + 1 < n) {
            setIndexVal(index => index + 1)
            setCurrentChoice(null)
        } else {
            if (running) {
                setRunning(false)
            }
        }
    }

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