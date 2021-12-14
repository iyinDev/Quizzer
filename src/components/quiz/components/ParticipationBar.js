import {useRef} from "react";

export function ParticipationBar() {
    const ref = useRef()

    return (
        <div className={"question-progress-background"}>
            <div ref={ref} className={"question-progress"}/>
        </div>
    )
}