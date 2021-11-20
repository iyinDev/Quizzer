import {useEffect, useRef, useState} from "react";

export function Choice(props) {
    const { mcq, curr } = props
    const { currentChoice, setCurrentChoice } = curr

    const ref = useRef()
    const [correct, setCorrect] = useState(null);

    const choiceClass =  props.class

    useEffect(() => {
        if (mcq) {
            setCorrect(mcq.choices[choiceClass] === mcq.correctAnswer)
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

    useEffect(() => {
        if (curr) {
            if (ref === currentChoice) {
                ref.current.className = "current " + choiceClass
            } else {
                ref.current.className = choiceClass
            }
        }
    }, [curr])

    const handler = () => {
        setCurrentChoice(ref)
    }

    return (
        <button ref={ref} onClick={handler} className={choiceClass}>{mcq? mcq.choices[choiceClass] : ""}</button>
    )
}