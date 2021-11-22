import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {generateQuizId} from "../services/generate-quiz-id";

// General buttons.

/**
 * A button that links the user to a page.
 * @param label The label of the button.
 * @param to The directory of the navigation destination.
 * @returns {JSX.Element}
 */
export function RouteLink({ label, to }) {
    return (
        <Link to={to}>
            <button className={"route-switch"} >{label}</button>
        </Link>
    )
}

/**
 * A button that links to the Home component.
 * @returns {JSX.Element}
 */
export function LinkToHome() {
    const auth = getAuth()

    return (
        <RouteLink to={"/home"} label={"Home"}/>
    )
}


// GenerateQuiz component buttons.

/**
 * The button to submit a Quiz form.
 * @param categories An Object containing all available categories { id: category } ( passed from the GenerateQuiz component )
 * @returns {JSX.Element}
 */
export function SubmitQuizFormButton({ categories }) {
    const navigate = useNavigate()

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
    function submitForm() {
        const inputs = {amount: document.getElementById("Amount"), category: document.getElementById("Category"), difficulty: document.getElementById("Difficulty"), type: document.getElementById("Type")}

        let form = {}
        for (let i in inputs) {
            if (i === "category") {
                form[i] = getCategoryId(inputs[i].innerHTML)
            } else {
                let elem = inputs[i]
                form[i] = inputs[i].innerHTML
            }
        }

        form['id'] = generateQuizId()
        console.log("Form submitted. -> "
            + "amount=" + form.amount
            + " category=" + form.category
            + " difficulty=" + form.difficulty
            + " type=" + form.type
            + " id=" + form.id
        )
        navigate('/quiz/' + form.id + "/" + form.amount + "/" + form.category + "/" + form.difficulty + "/" + form.type)
    }

    return (
        <button className={"submit-quiz-form"} type={"submit"} value={"Submit"} onClick={submitForm}>Submit</button>
    )
}