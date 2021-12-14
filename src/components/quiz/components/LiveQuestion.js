import {useEffect, useRef, useState} from "react";
import {ProgressBar} from "./ProgressBar";
import {NextQuestion} from "./NextQuestion";
import {Choice} from "./Choice";
import {LiveChoice} from "./LiveChoice";

export function LiveQuestion({question, answeredState, answeredCountDocState, choicesState, time, initialTime, summaryState}) {
    const ref = useRef()

    const questionRunning = useState(false)

    const [answered] = answeredState
    const [choices] = choicesState

    const correctState = useState(null)

    useEffect(() => {
        if (!answered) {
            Object.keys(choices).forEach(key => {
                if (choices[key]) {
                    choices[key].current.className = "choice"
                    choices[key].current.disabled = false
                }
            })
        }
    }, [answered, choices])

    useEffect(() => {
        console.log(summaryState[0])
    }, [summaryState[0]])

    return (
        <div>
            <div ref={ref} className={"question"}>
                <div id={"question-card"} className={"question-card"}>{question? question.question : ""}</div>
                <ProgressBar runningState={questionRunning} time={time} initialTime={initialTime}/>
            </div>
            <div className={"choices"}>
                {choices && Object.keys(choices).map(key => <LiveChoice
                    question={question}
                    choiceClass={key}
                    answeredState={answeredState}
                    answeredCountDocState={answeredCountDocState}
                    correctState={correctState}
                    choicesState={choicesState}
                    summaryState={summaryState}/>)}
            </div>
        </div>
    )
}