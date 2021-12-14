// noinspection JSUnresolvedVariable

import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {NextQuestion} from "./NextQuestion";
import {ProgressBar} from "./ProgressBar";
import {Choice} from "./Choice";

/**
 * Displays on MultipleChoiceQuestionBucket.
 * @returns {JSX.Element}
 */
export function Question({question, answeredState, choicesState, time, initialTime, summaryState, indexState, runningState}) {
    const ref = useRef()

    // const answeredState = useState(null), [answered] = answeredState
    // const correctState = useState(null)
    // const choicesState = useState({
    //     A: null,
    //     B: null,
    //     C: null,
    //     D: null
    // }), [choices] = choicesState

    const questionRunning = useState(null)

    const [answered] = useState(false)
    const [choices] = choicesState

    const correctState = useState(null)

    // useEffect(() => {
    //     if (!answered) {
    //         Object.keys(choices).forEach(key => {
    //             if (choices[key]) {
    //                 choices[key].current.className = "choice"
    //                 choices[key].current.disabled = false
    //             }
    //         })
    //     }
    // }, [])

    return (
        <div>
            <div ref={ref} className={"question"}>
                <div id={"question-card"} className={"question-card"}>{question? question.question : ""}
                    <NextQuestion
                        indexState={indexState}
                        runningState={runningState}/>
                </div>
                <ProgressBar
                    runningState={runningState}
                    initialTime={initialTime}/>
            </div>
            <div className={"choices"}>
                {choices && Object.keys(choices).map(key => <Choice
                    question={question}
                    choiceClass={key}
                    answeredState={answeredState}
                    correctState={correctState}
                    choicesState={choicesState}
                    summaryState={summaryState}/>)}
            </div>
        </div>
    )
}