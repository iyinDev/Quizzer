import {useEffect, useRef } from "react";
import useCountDown from 'react-countdown-hook';

export function ProgressBar(props) {
    const ref = useRef()

    const { rnning } = props
    const { running, setRunning } = rnning

    const initialTime = 1 * 60 * 1000
    const interval = 1000
    const [timeLeft, { start, reset }] = useCountDown(initialTime, interval)

    useEffect(() => {
        start()
        setRunning(true)
    }, [])

    function launchResults() {
        ref.current.style.width = '0'
        document.getElementById('question-card').style.background = "indianred"
        setTimeout(() => {
            document.getElementById('results').style.display = "block"
        }, 200)
    }

    useEffect(() => {
        if (timeLeft === 0 && running) {
            console.log("Timer done.")
            setRunning(false)
            launchResults()
        } else if (timeLeft !== 0 && !running) {
            reset()
            launchResults()
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