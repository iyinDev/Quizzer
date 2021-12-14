import {InputQID} from "./components/InputQID";
import {useState} from "react";

export function QuizzerJoin() {

    const inputState = useState('')
    const displayNameState = useState('')

    return (
        <div>
            <InputQID inputState={inputState} displayNameState={displayNameState}/>
        </div>
    )
}