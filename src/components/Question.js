import {useEffect, useRef, useState} from "react";
import {Choice} from "./Choice";
import {ProgressBar} from "./ProgressBar";
import useCountDown from "react-countdown-hook";
import {Check} from "./Check";

export function MultipleChoiceQuestion(props) {
    const { scre } = props
    const ref = useRef()
    const [ currentChoice, setCurrentChoice ] = useState(null), curr = {currentChoice: currentChoice, setCurrentChoice: setCurrentChoice}
    const [running, setRunning] = useState(false), rnning = {running: running, setRunning: setRunning}

    return (
        <div>
            <div className={"question"}>
                <div id={"question-card"} className={"question-card"}>{props.mcq? props.mcq.question : ""}
                    <Check answer={props.mcq? props.mcq.correctAnswer : null} curr={curr} usrAnswrs={props.userAnswers} index={props.index} rnning={rnning} scre={scre}/>
                </div>
                <ProgressBar rnning={rnning}/>
            </div>
            <div className={"choices"}>
                <Choice mcq={props.mcq} class={"A"} curr={curr}/>
                <Choice mcq={props.mcq} class={"B"} curr={curr}/>
                <Choice mcq={props.mcq} class={"C"} curr={curr}/>
                <Choice mcq={props.mcq} class={"D"} curr={curr}/>
            </div>
            {/*<div>{props.mcq? props.mcq.correctAnswer : ""}</div>*/}
        </div>
    )
}