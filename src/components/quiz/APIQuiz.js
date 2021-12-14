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


function Results({ summary, qid, hideModal, share }) {
    const { state } = useLocation()
    const navigate = useNavigate()

    const [questions] = useState(state? state.quiz : null)
    const [quizSummary] = summary

    /**
     * Adds the current quiz to the firestore "public-quizzes" collection
     * @returns {JSX.Element}
     */
    function Share() {
        const ref = useRef()
        function shareQuiz() {
            const db = getFirestore()
            const auth = getAuth(), user = auth.currentUser.displayName

            const newPublicQuiz = doc(db, 'public-quizzes', qid)

            console.log(questions)
            const newDoc = createQuizDoc(questions, quizSummary.points, qid)
            newDoc['createdBy'] = user
            setDoc(newPublicQuiz, newDoc).then(() => {
                console.log("Document set at " + newPublicQuiz.path + ".")
            }).catch(e => console.log(e.message))
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
                {share && <Share questions={questions}/>}
                {/*<AddToChallengeQuizzes qid={qid} score={quizSummary.points} questions={questions}/>*/}
                <button className={"card report-bt"} onClick={() => {navigate('/home')}}>HOME</button>
            </div>
        </Modal>
    )
}

export function APIQuiz() {
    const { state } = useLocation()
    const { qid } = useParams()

    // The quiz questions.
    const [ questions] = useState(state.quiz)
    const [initialTime] = useState(state.quiz.length * window.$SECONDS_PER_QUESTION)

    const answeredState = useState(null),
        [answered, setAnswered] = answeredState
    useEffect(() => {

    }, [answered])

    const choicesState = useState({
        A: null,
        B: null,
        C: null,
        D: null
    }), [choices] = choicesState

    // The current index of the user in the questions state Array.
    const indexState = useState(0),
        [ index, setIndex ] = indexState
    useEffect(() => {
        if (choices.A) {
            for (let choice in choices) {
                const currChoice = choices[choice]
                currChoice.current.className = 'choice'
                currChoice.current.disabled = false
            }
        }
    }, [index])

    // A summary of the user's quiz progress (e.g. # of correct answers, # of incorrect answers, points, etc.).
    const summary = useState({
            points: 0,
            correctCount: 0,
            incorrectCount: 0,
            totalCount: 0
    }),
        [ quizSummary ] = summary

    // The running state of the entirety of the quiz.
    const runningState = useState(null),
        [running] = runningState

    // Automatic book-keeping of the user quiz on completion.
    useEffect(() => {
        recordOnComplete(running, quizSummary, questions, qid)
    }, [qid, questions, quizSummary, quizSummary.points, running])

    const [showResultsModal, hideResultsModal] = useModal(() => (
        <Results qid={qid} summary={summary} questions={questions} hideModal={hideResultsModal}/>
    ), [summary])
    useEffect(() => {
        if (running === false) {
            showResultsModal()
        }
    }, [runningState, quizSummary, showResultsModal])


    return (
        <div>
            <div className={"quiz"}>
                <Score summary={summary}/>
                <span className={"logo"}>QUIZZER!</span>
                <Question question={questions[index]}
                          indexState={indexState}
                          initialTime={initialTime}
                          runningState={runningState}
                          summaryState={summary}
                          answeredState={answeredState}
                          choicesState={choicesState}/>
            </div>
        </div>
    )
}