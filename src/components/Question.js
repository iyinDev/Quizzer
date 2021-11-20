import {useEffect, useRef, useState} from "react";
import {ChoiceMCQ} from "./ChoiceMCQ";
import {ProgressBar} from "./ProgressBar";
import useCountDown from "react-countdown-hook";
import {ChoiceEvaluator} from "./ChoiceEvaluator";

/**
 * Displays on MultipleChoiceQuestionBucket
 */
export function MultipleChoiceQuestion(props) {
    const { scre, mcq, usrAnswrs, indx } = props
    const ref = useRef()
    const [ currentChoice, setCurrentChoice ] = useState(null), curr = {currentChoice: currentChoice, setCurrentChoice: setCurrentChoice}
    const [running, setRunning] = useState(false), rnning = {running: running, setRunning: setRunning}

    return (
        <div>
            <div className={"question"}>
                <div id={"question-card"} className={"question-card"}>{mcq? mcq.question : ""}
                    <ChoiceEvaluator answer={mcq? mcq.correctAnswer : null} curr={curr} usrAnswrs={usrAnswrs} indx={indx} rnning={rnning} scre={scre}/>
                </div>
                <ProgressBar rnning={rnning}/>
            </div>
            <div className={"choices"}>
                <ChoiceMCQ mcq={mcq} class={"A"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} class={"B"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} class={"C"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} class={"D"} curr={curr}/>
            </div>
            {/*<div>{props.mcq? props.mcq.correctAnswer : ""}</div>*/}
        </div>
    )
}