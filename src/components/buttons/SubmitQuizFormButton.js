import "../../public/generate-quiz.css"
import {generateQuizId} from "../../services/generate-quiz-id";
import {useNavigate} from "react-router-dom";

export function SubmitQuizFormButton({ categories }) {
    const navigate = useNavigate()

    function getCategoryId(category) {
        for (let i in categories) {
            if (categories[i] === category) return i
        }
    }

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