/**
 * The Score component.
 * @returns {JSX.Element}
 */

import {useRef} from "react";

export function Score({ summary }) {
    const [quizSummary] = summary
    const ref = useRef()

    return (
        <div ref={ref} className={"score card"}>YOUR SCORE: {quizSummary.points}</div>
    )
}