import {useEffect, useRef, useState} from "react";

/**
 * The Multiple Choice Question Choice component.
 */
export function ChoiceMCQ(props) {
    const { mcq, curr } = props
    const { currentChoice, setCurrentChoice } = curr

    const ref = useRef()

    const choiceClass =  props.class

    // Adjusts text size based on string length.
    useEffect(() => {
        if (mcq) {
            const text = mcq.choices[choiceClass]
            if (text.length >= 30) {
                ref.current.style.fontSize = "4vmin"
            } else if (text.length < 30 && text.length >= 15 ) {
                ref.current.style.fontSize = "4.5vmin"
            } else {
                ref.current.style.fontSize = "7vmin"
            }
        }
    }, [props])

    // Applies the "current" effect on a selected Choice component.
    useEffect(() => {
        if (curr) {
            if (ref === currentChoice) {
                ref.current.className = "current " + choiceClass
            } else {
                ref.current.className = choiceClass
            }
        }
    }, [curr])

    // Sets ref as the currentChoice state.
    const handler = () => {
        setCurrentChoice(ref)
    }

    return (
        <button ref={ref} onClick={handler} className={choiceClass}>{mcq? mcq.choices[choiceClass] : ""}</button>
    )
}