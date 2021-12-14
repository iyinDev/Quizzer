import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";
import useFetch from "use-http";
import {generateQuizPath, loadQuizFromQuery} from "../../utils/utils";
import {Player} from "../../../../utils/classes/Player";
import {doc, getFirestore, setDoc} from "firebase/firestore";

/**
 * The button to submit a Quiz form.
 * @param categories An Object containing all available categories { id: category } ( passed from the GenerateQuiz component )
 * @returns {JSX.Element}
 */
export function SubmitLiveQuizFormButton({ categories }) {
    const navigate = useNavigate()
    const auth = getAuth()
    const db = getFirestore()

    const { get, response } = useFetch('https://opentdb.com')

    function generateQuizId() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4()+ S4() + "-" + S4())
    }

    /**
     * Gets the category ID from the passed prop.
     * @param category The String value of a category in the categories Object.
     * @returns {string} The ID of the queried category.
     */
    function getCategoryId(category) {
        for (let i in categories) {
            if (categories[i] === category) return i
        }
    }

    /**
     * Submits quiz configuration and navigate to generated quiz page.
     */

    async function submitForm() {
        const qid = window.$ID_GENERATOR()
        // Gets references of all form input divs.
        const inputs = {
            amount: document.getElementById("Amount"),
            category: document.getElementById("Category"),
            difficulty: document.getElementById("Difficulty"),
            type: document.getElementById("Type")
        }
        let form = {}
        form['id'] = generateQuizId()
        // Gets value from each input div.
        for (let i in inputs) {
            if (i === "category") {
                // Gets id code of a category text value to make valid API call.
                form[i] = (inputs[i].innerHTML !== "") ? getCategoryId(inputs[i].innerHTML) : ""
            } else {
                form[i] = inputs[i].innerHTML
            }
        }

        const {amount, category, difficulty, type} = form
        const quizParams = [
            ((amount === '') ? '10' : amount),
            ((category === '') ? '9' : category),
            ((difficulty === '') ? 'easy' : difficulty),
            ((type === '') ? 'multiple' : type)] // form values are filtered here

        const skeleton = '/api.php?'
        const query = skeleton + ("&amount=" + quizParams[0]) + ("&category=" + quizParams[1]) + ("&difficulty=" + quizParams[2]) + ("&type=" + quizParams[3])
        const qR = await get(query)

        const quizData = []
        loadQuizFromQuery(response, qR).forEach(bucket => {
            quizData.push(bucket.data)
        })
        const initialTime = window.$SECONDS_PER_QUESTION_LIVE
        await setDoc(doc(db, 'live-quizzes', qid), {
            quiz: quizData,
            initialTime: initialTime,
            answeredCount: 0
        }, {merge: true})

        const livePlayer = new Player(auth.currentUser.displayName)

        const quizRoute = '/quiz/live/' + qid
        navigate(quizRoute, {
                state: {
                    ...livePlayer.user,
                },
            }
        )
        console.log("Quiz route. -> " + quizRoute)
    }

    return (
        <button type={"submit"} value={"Submit"}
                onClick={submitForm}>Live Quiz</button>
    )
}