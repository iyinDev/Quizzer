import {addDoc, collection, doc, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import {getAuth} from "firebase/auth";

export function createQuizDoc(quizData, score, qid, title = null) {
    debugger
    let extracted = []
    Object.keys(quizData).forEach(question => {
        extracted.push({
            question: quizData[question].question,
            choices: quizData[question].choices,
            correctAnswer: quizData[question].correctAnswer,
            category: quizData[question].category,
            difficulty: quizData[question].difficulty
        })
    })

    return {
        title: title ? title : qid,
        qid: qid,
        data: extracted,
        score: score,
        createdAt: Timestamp.fromDate(new Date()),
    }
}

export function recordOnComplete(running, quizSummary, questions, qid) {
    if (running === false) {
        const auth = getAuth()
        const db = getFirestore()

        const score = quizSummary.points

        const userMetadata = {
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName
        }

        const userRef = doc(db, 'users', auth.currentUser.uid)
        // noinspection JSCheckFunctionSignatures
        setDoc(userRef, userMetadata).then(() => {
            console.log("Document set at " + userHistory.path)
        }).catch(error => {
            console.log("Error. -> " + error.message)
        })
        const userHistory = doc(userRef, 'quiz-history', qid)
        debugger
        const newDoc = createQuizDoc(questions, score, qid)
        setDoc(userHistory, newDoc).then(() => {
            console.log("Document set at " + userHistory.path)
        })
        const leaderboard = collection(db, 'leaderboard')
        addDoc(leaderboard, {score: score, user: auth.currentUser.displayName, createdAt: Timestamp.fromDate(new Date())}).then(() => {
            console.log("Document set at " + leaderboard.path)
        })
    }
}