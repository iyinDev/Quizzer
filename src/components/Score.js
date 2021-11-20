import {useRef} from "react";

export function Score(props) {
    const { scre } = props
    const { score, setScore } = scre
    const ref = useRef()

    return (
        <div ref={ref} className={"score"}>YOUR SCORE: {score}</div>
    )
}