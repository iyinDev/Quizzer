import useFetch from "use-http";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";
import {generateQuizPath, loadQuizFromQuery} from "../../quiz/utils/utils";
import {DropdownMenu} from "../../../utils/components/DropdownMenu";

/**
 * The button to submit a Quiz form.
 * @param categories An Object containing all available categories { id: category } ( passed from the GenerateQuiz component )
 * @returns {JSX.Element}
 */
export function SubmitQuizFormButton({ categories }) {
    const navigate = useNavigate()
    const auth = getAuth()
    const { get, response } = useFetch('https://opentdb.com')

    function generateQuizId() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
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

        const {id, amount, category, difficulty, type} = form
        const quizParams = [
            ((amount === '') ? '10' : amount),
            ((category === '') ? '9' : category),
            ((difficulty === '') ? 'easy' : difficulty),
            ((type === '') ? 'multiple' : type)] // form values are filtered here

        const skeleton = '/api.php?'
        const query = skeleton + ("&amount=" + quizParams[0]) + ("&category=" + quizParams[1]) + ("&difficulty=" + quizParams[2]) + ("&type=" + quizParams[3])
        const qR = await get(query)

        let responseQuestions = loadQuizFromQuery(response, qR)

        const quizRoute = '/quiz/' + generateQuizPath(auth)
        navigate(quizRoute, {
                state: {
                    quiz: responseQuestions,
                    initialTime: ((amount === '') ? 10 * window.$SECONDS_PER_QUESTION : amount * window.$SECONDS_PER_QUESTION)},
            }
        )
        console.log("Quiz route. -> " + quizRoute)
    }

    return (
        <button className={"card submit-quiz-form"} type={"submit"} value={"Submit"}
                onClick={submitForm}>Submit</button>
    )
}

/**
 * The Forms used on the GenerateQuiz page.
 * @param label a String containing the label of the form { amount, category, difficulty, type }.
 * @param content an Object where each key value is a list item for the DropdownMenu.
 * @returns {JSX.Element}
 */
export function QuizInput({ label, content }) {
    const [ formValue, setFormValue ] = useState("")

    return (
        <div className={"vertical"}>
            <label className={label.toLowerCase() + "-label"}>{label}</label>
            <div className={"h"}>
                <div id={label} className={label.toLowerCase()} type={"text"}>{formValue}</div>
                <DropdownMenu label={label} content={content} formSetter={setFormValue}/>
            </div>
        </div>
    )
}


