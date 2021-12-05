import {getAuth} from "firebase/auth";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useCountDown from "react-countdown-hook";
import {useEffect, useRef, useState} from "react";
import {ScoreBubble} from "./components/ScoreBubble";
import {Question} from "./components/Question";
import {Score} from "./components/Score";
import {recordOnComplete} from "./utils/doc-utiils";

export function PreloadedQuiz() {
    const { state } = useLocation()
    const { qid } = useParams()

    const [ questions ] = useState(state.quiz)

    const indexState = useState(0),
        [ index] = indexState

    const summary = useState({
            points: 0,
            correctCount: 0,
            incorrectCount: 0,
            totalCount: 0
    }),
        [ quizSummary] = summary

    // The running state of the entirety of the quiz.
    const runningState = useState(null),
        [running] = runningState

    // The countdown timer being used for the ProgressBar.
    const time = useCountDown(state.initialTime, 1000)

    // Listens for changes to quizSummary.
    useEffect(() => {
        console.log(quizSummary)
    }, [quizSummary])

    // Automatic book-keeping of the user quiz on completion.
    useEffect(() => {
        recordOnComplete(running, quizSummary, questions, qid)
    }, [qid, questions, quizSummary.points, running])

    function PreloadedQuizResults({ summary }) {
        const ref = useRef()
        const auth = getAuth()
        const navigate = useNavigate()

        const [quizSummary] = summary

        return (
            <div ref={ref} id={"results"} className={"results-background"}>
                <span className={"logo-user"}>QUIZZER! - {auth.currentUser.displayName}</span>
                <div className={"results-container"}>
                    <div className={"report"}>
                        <ScoreBubble label={"correct"} value={quizSummary.correctCount}/>
                        <ScoreBubble label={"incorrect"} value={quizSummary.incorrectCount}/>
                        <ScoreBubble label={"total"} value={quizSummary.totalCount}/>
                    </div>
                    <div className={"report-buttons"}>
                        <button className={"report-bt"} onClick={() => {
                            navigate("/home")
                        }}>HOME</button>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            <PreloadedQuizResults summary={summary}/>
            <div className={"quiz"}>
                <Score summary={summary}/>
                <span className={"logo"}>QUIZZER!</span>
                <Question question={questions[index]} indexState={indexState} timeState={time} runningState={runningState} summaryState={summary} />
            </div>
        </div>
    )
}