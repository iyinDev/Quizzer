import {useRef} from "react";
import {useLocation} from "react-router-dom";

/**
 * The button to check a choice and move to the next question.
 * @returns {JSX.Element}
 */
export function NextQuestion({ indexState, runningState}) {
    const ref = useRef()

    const { state } = useLocation()

    const [ index, setIndex ] = indexState
    const [ running, setRunning ] = runningState

    /**
     * Moves to next question or ends quiz if last question has been answered.
     */
    function nextQuestion() {
        if (index + 1 < state.quiz.length) {
            setIndex(index => index + 1)
        } else {
            if (running) {
                setRunning(false)
            }
        }
    }

    return (
        <button ref={ref} onClick={nextQuestion} className={"check card"}/>
    )
}