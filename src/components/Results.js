import {useEffect, useRef, useState} from "react";

export function Results(props) {
    const ref = useRef()
    const [correctAnswers, setCorrectAnswers] = useState([])

    const { usrAnswrs, index } = props
    const { userAnswers } = usrAnswrs

    const { n } = index

    useEffect(() => {
        let count = 0
        userAnswers.forEach(answer => count += (answer === true? 1 : 0))
        const fraction = count + "/" + n + "!"
        setCorrectAnswers('YOU SCORED: ' + fraction)
    }, [userAnswers])

    return (
        <div ref={ref} id={"results"} className={"results-background"}>
            <div className={"results-container"}>
                <div className={"results"}>{correctAnswers}</div>
            </div>
        </div>
    )
}