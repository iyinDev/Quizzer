import {useRef} from "react";

/**
 * The Score component.
 */
export function Score(props) {
    const { scre } = props
    const { score} = scre
    const ref = useRef()

    return (
        <div ref={ref} className={"score"}>YOUR SCORE: {score}</div>
    )
}