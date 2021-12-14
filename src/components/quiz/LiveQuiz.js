import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {doc, getFirestore, setDoc, arrayUnion, increment} from "firebase/firestore";

import { initializeApp } from 'firebase/app';
import { getDatabase, child, ref, update, onDisconnect } from "firebase/database";
import {useDocumentData} from "react-firebase-hooks/firestore";
import useCountDown from "react-countdown-hook";
import {LiveQuestion} from "./components/LiveQuestion";
import {Score} from "./components/Score";

// Get a reference to the dbActive service

const firebaseConfig = require("../../utils/firebase-config.json")
const database = initializeApp(firebaseConfig)
const dbActive = getDatabase(database);

export function LiveQuiz() {
    const { state } = useLocation(), navigate = useNavigate()
    const { qid } = useParams()

    const choicesState = useState({
        A: null,
        B: null,
        C: null,
        D: null
    }), [choices] = choicesState

    // The current index of the user in the questions state Array.
    const indexState = useState(0),
        [ index, setIndex ] = indexState

    // A summary of the user's questions progress (e.g. # of correct answers, # of incorrect answers, points, etc.).
    const summary = useState({
            points: 0,
            correctCount: 0,
            incorrectCount: 0,
            totalCount: 0
        }),
        [ quizSummary] = summary

    const db = getFirestore()
    const quizActivityRef = ref(dbActive, "quizzes", qid)
    const quizDoc = doc(db, 'live-quizzes', qid)

    const answeredState = useState(null), [answered, setAnswered] = answeredState

    const incrementAnsweredCountDoc = useCallback(() => {
        setDoc(quizDoc, { answeredCount : increment(1)}, {merge: true}).then()
    })
    const resetAnsweredCountDoc = useCallback(() => {
        setDoc(quizDoc, {answeredCount: 0}, {merge: true})
    })
    const answeredCountDocState = [incrementAnsweredCountDoc, resetAnsweredCountDoc]

    // Authorizes user.
    useEffect(() => {
        if (state) {
            console.log(state.displayName + ' successfully added to Document ' + qid + ".")
        } else {
            console.log("Uninitiated user. Redirecting to '/join'")
            navigate('/join')
        }
    }, [state])

    const [user, setUser] = useState(state.displayName)
    // When the user is initiated.
    useEffect(() => {
        if (user) {
            const usersRef = child(quizActivityRef, "/" + qid + "/users/" + user)

            onDisconnect(usersRef).update({
                active: false,
            }).then(null)
            console.log(user + " has joined.")
        }
    }, [user])

    const activeUsersState = useState(null), [activeUsers, setActiveUsers] = activeUsersState
    // // If the active users change.
    // useEffect(() => {
    //     if (activeUsers) {
    //         console.log("Active users. -> " + activeUsers)
    //     }
    // }, [activeUsers])

    const questionsState = useState(null), [questions, setQuestions] = questionsState
    const runningState = useState(null), [running, setRunning] = runningState

    // The countdown timer being used for the ProgressBar.
    const time = useCountDown(window.$SECONDS_PER_QUESTION_LIVE, 1000),
        [,{ start }] = time

    const participantCountState = useState(0), [particpantCount, setParticipantCount] = participantCountState

    const [value] = useDocumentData(doc(db, 'live-quizzes', qid))
    // Watches for changes on the questions document.


    useEffect(() => {
        if (value) {
            const { activeUsers, quiz, running, initialTime, answeredCount } = value
            setActiveUsers(activeUsers)
            setQuestions(quiz)
            setRunning(running)

            if (activeUsers && answeredCount === activeUsers.length) {
                setIndex(index + 1)
                setAnswered(true)
                resetAnsweredCountDoc()
                for (let choice in choices) {
                    // For each choice button
                }
                start(window.$SECONDS_PER_QUESTION_LIVE)
            }
        }
    }, [value])

    // useEffect(() => {
    //     console.log(index)
    // }, [index])

    // Initialize LiveQuiz.
    useEffect(() => {
        function setUser (displayName, quizRef, host = false) {

            const userPath = '/' + qid + '/users/' + displayName
            const postData = { active: true, users: [] }

            const updates = {};
            updates[userPath] = postData;

            const user = {
                running: false,
                activeUsers: arrayUnion(displayName),
            }
            if (host) user['host'] = displayName

            setDoc(quizDoc,  user, {merge: true}).then(null)
            return update(quizRef, updates);
        }

        if (state && user && value) {
            setUser(user, quizActivityRef, !value.host).then(null).catch(error => {
                console.log(error.message())
            })
        }

    }, [quizDoc, state])

    return (
        <div className={'quiz'}>
            {activeUsers && activeUsers.map(user => (<div>{user}</div>))}
            {<LiveQuestion
                question={questions? questions[index] : ""}
                answeredState={answeredState}
                answeredCountDocState={answeredCountDocState}
                choicesState={choicesState}
                initialTime={window.$SECONDS_PER_QUESTION_LIVE}
                time={time}
                summaryState={summary}/>}
             </div>
    )
}