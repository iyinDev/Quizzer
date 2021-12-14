import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import useCountDown from "react-countdown-hook";

/**
 * The progress bar at the bottom of the question card.
 * @returns {JSX.Element}
 */
export function ProgressBar({ runningState, initialTime, time }) {
    const ref = useRef()

    const [ running, setRunning ] = runningState
    const [timeLeft, {start}] = useCountDown(0)

    useEffect(() => {
        if ( initialTime) {
            start(initialTime)
            setRunning(true)
        }
    }, [initialTime, setRunning, start])

    // Checks if the timer has completed or is still running to display results.
    useEffect(() => {
        if (!timeLeft && !running) {
            setRunning(true)
        } else if (!timeLeft && running) {
            ref.current.style.width = 0
            setRunning(false)
        } else {
            ref.current.style.width = ((timeLeft / initialTime) * 100) + "%"
        }

    }, [initialTime, running, setRunning, timeLeft])

    return(
        <div className={"question-progress-background"}>
            <div ref={ref} className={"question-progress"}/>
        </div>

    )
}