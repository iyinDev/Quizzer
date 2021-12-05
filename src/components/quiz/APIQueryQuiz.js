import {useLocation, useNavigate, useParams} from "react-router-dom";
import useCountDown from "react-countdown-hook";
import {getAuth} from "firebase/auth";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";


import {useModal} from "react-modal-hook";

import {createQuizDoc, recordOnComplete} from "./utils/doc-utiils";
import {Modal} from "../../utils/modal";

import {ScoreBubble} from "./components/ScoreBubble";
import {Score} from "./components/Score.js";
import {Question} from "./components/Question.js";


function Results({ summary, qid, hideModal }) {
    debugger

    const navigate = useNavigate()
    const [quizSummary] = summary

    useEffect(() => {
        console.log(summary, qid, hideModal)
    }, [summary, qid, hideModal])

    /**
     * Adds the current quiz to the firestore "public-quizzes" collection
     * @param questions A Array of QuestionBucket objects.
     * @returns {JSX.Element}
     */
    function Share(questions) {
        const ref = useRef()
        function shareQuiz() {
            const db = getFirestore()
            const auth = getAuth(), user = auth.currentUser.displayName

            const newPublicQuiz = doc(db, 'public-quizzes', qid)

            const newDoc = createQuizDoc(questions, quizSummary.points, qid)
            newDoc['createdBy'] = user

            setDoc(newPublicQuiz, newDoc).then(() => {
                console.log("Document set at " + newPublicQuiz.path + ".")
            })
            ref.current.disabled = true
        }

        return (
            <button ref={ref} className={"card share report-bt"} onClick={shareQuiz}>SHARE QUIZ</button>
        )
    }

    return (
        <Modal header={"YOU SCORED: " + quizSummary.points} hideModal={hideModal} noExit={true}>
            <div className={"report"}>
                <ScoreBubble label={"correct"} value={quizSummary.correctCount}/>
                <ScoreBubble label={"incorrect"} value={quizSummary.incorrectCount}/>
                <ScoreBubble label={"total"} value={quizSummary.totalCount}/>
            </div>
            <div className={"report-buttons"}>
                <Share/>
                {/*<AddToChallengeQuizzes qid={qid} score={quizSummary.points} questions={questions}/>*/}
                <button className={"card report-bt"} onClick={() => {navigate('/home')}}>HOME</button>
            </div>
        </Modal>
    )
}

export function APIQueryQuiz() {
    const { state } = useLocation()
    const { qid } = useParams()

    // The quiz questions.
    const [ questions] = useState(state.quiz)

    // The current index of the user in the questions state Array.
    const indexState = useState(0),
        [ index ] = indexState

    // A summary of the user's quiz progress (e.g. # of correct answers, # of incorrect answers, points, etc.).
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
    }, [qid, questions, quizSummary, quizSummary.points, running])

    const [showResultsModal, hideResultsModal] = useModal(() => (
        <Results qid={qid} summary={summary} hideModal={hideResultsModal}/>
    ), [summary])
    useEffect(() => {
        if (running === false && quizSummary.totalCount > 0) {
            showResultsModal()
        }
    }, [running, quizSummary, showResultsModal])


    return (
        <div>
            <div className={"quiz"}>
                <Score summary={summary}/>
                <span className={"logo"}>QUIZZER!</span>
                <Question question={questions[index]} indexState={indexState} timeState={time} runningState={runningState} summaryState={summary} />
            </div>
        </div>
    )
}