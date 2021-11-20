import {useEffect, useRef } from "react";
import useCountDown from 'react-countdown-hook';

/**
 * The progress bar at the bottom of the question card.
 */
export function ProgressBar(props) {
    const ref = useRef()

    const { rnning } = props
    const { running, setRunning } = rnning

    const initialTime = 1 * 60 * 1000
    const interval = 1000
    const [timeLeft, { start, reset }] = useCountDown(initialTime, interval)

    // Display the results modal.
    function displayResults() {
        ref.current.style.width = '0'
        document.getElementById('question-card').style.background = "indianred"
        setTimeout(() => {
            document.getElementById('results').style.display = "block"
        }, 200)
    }

    // Starts the timer on load.
    useEffect(() => {
        start()
        setRunning(true)
    }, [])

    // Checks if the timer has completed or is still running to display results
    useEffect(() => {
        if (timeLeft === 0 && running) {
            console.log("Timer done.")
            setRunning(false)
            displayResults()
        } else if (timeLeft !== 0 && !running) {
            reset()
            displayResults()
        } else {
            ref.current.style.width = ((timeLeft / initialTime) * 100) + "%"
            ref.current.style.width = ((timeLeft / initialTime) * 100) + "%"
        }

    }, [timeLeft, running])

    return(
        <div className={"question-progress-background"}>
            <div ref={ref} className={"question-progress"}/>
        </div>

    )
}