import {useRef, useState} from "react";
import {NextQuestion} from "./NextQuestion";
import {ProgressBar} from "./ProgressBar";
import {Choice} from "./Choice";

/**
 * Displays on MultipleChoiceQuestionBucket.
 * @returns {JSX.Element}
 */
export function Question({question, answeredState, choicesState, time, initialTime, summaryState, indexState, runningState}) {
    const ref = useRef()

    const [choices] = choicesState

    const correctState = useState(null)

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
                    key={key}
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