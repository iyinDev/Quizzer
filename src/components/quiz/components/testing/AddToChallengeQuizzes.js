import {doc, getFirestore, setDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {createQuizDoc} from "../../utils/doc-utiils";
import {useRef} from "react";

/**
 * Adds the current quiz to the firestore "challenge-quizzes" collection
 * @param questions A Array of QuestionBucket objects.
 * @param score
 * @param qid
 * @returns {JSX.Element}
 */
export function AddToChallengeQuizzes({questions, score, qid}) {
    const ref = useRef()

    function shareQuiz() {
        const title = prompt("Enter the title", "")
        const db = getFirestore()
        const auth = getAuth(), user = auth.currentUser.displayName

        const newChallengeQuiz = doc(db, 'challenge-quizzes', qid)

        const newDoc = createQuizDoc(questions, score, qid, title)
        newDoc['createdBy'] = user
        setDoc(newChallengeQuiz, newDoc).then(() => console.log("Document set at " + newChallengeQuiz.path + "."))
        ref.current.disabled = true
    }

    return (
        <button ref={ref} className={"card share report-bt"} onClick={shareQuiz}>CHALLENGE</button>
    )
}