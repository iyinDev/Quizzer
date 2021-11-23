import {useEffect, useState} from "react";
import useFetch from "use-http";
import {useNavigate} from "react-router-dom";
import {LinkToHome} from "./routes";

// GenerateQuiz helper classes and functions.

function generateQuizId() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+ S4() + "-" + S4())
}


// GenerateQuiz components.

/**
 * The item in the DropdownMenu.
 * @param value tne text value of the DropdownItem.
 * @param formSetter a function that sets the innerHTML value of the input div.
 * @returns {JSX.Element}
 */
function DropdownItem({ value, formSetter }) {
    const [ itemValue ] = useState(value)

    return (
        <a onClick={() => {
            formSetter(itemValue)
        }}>{itemValue}</a>
    )
}

/**
 * The menu containing the available options.
 * @param label a String containing the label of the form { amount, category, difficulty, type }.
 * @param content an Object where each key value is a list item for the DropdownMenu.
 * @param formSetter a function that sets the innerHTML value of the input div ( passed to DropdownItem ).
 * @returns {JSX.Element}
 */
function DropdownMenu({ label, content, formSetter }) {

    /**
     * Shows the DropdownMenu div
     */
    function dropdownMenuHandler() {
        document.getElementById(label.toLowerCase()).classList.toggle("show");
    }

    return (
        <div>
            <button onClick={dropdownMenuHandler} className={"dropbtn"}>▼</button>
            <div id={label.toLowerCase()} className={"dropdown-content"}>
                {content && Object.keys(content).map((key, index) => <DropdownItem key={key} value={content[key]} formSetter={formSetter}/>)}
            </div>
        </div>
    )
}

/**
 * The Forms used on the GenerateQuiz page.
 * @param label a String containing the label of the form { amount, category, difficulty, type }.
 * @param content an Object where each key value is a list item for the DropdownMenu.
 * @returns {JSX.Element}
 */
function QuizParameterForm({ label, content }) {
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


// GenerateQuiz component buttons.

/**
 * The button to submit a Quiz form.
 * @param categories An Object containing all available categories { id: category } ( passed from the GenerateQuiz component )
 * @returns {JSX.Element}
 */
function SubmitQuizFormButton({ categories }) {
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
                form[i] = (inputs[i].innerHTML !== "")? getCategoryId(inputs[i].innerHTML) : ""
            } else {
                form[i] = inputs[i].innerHTML
            }
        }

        const {id, amount, category, difficulty, type} = form
        const quizParams = [
            ((amount === '')? '10' : amount),
            ((category === '')? '9' : category),
            ((difficulty === '')? 'easy' : difficulty),
            ((type === '')? 'multiple' : type)] // form values are filtered here
        const quizRoute = '/quiz/' + id + '/' + quizParams[0] + '/' + quizParams[1] + '/' + quizParams[2] + '/' + quizParams[3]
        navigate(quizRoute)
        console.log("Quiz route. -> " + quizRoute)
    }

    return (
        <button className={"submit-quiz-form"} type={"submit"} value={"Submit"} onClick={submitForm}>Submit</button>
    )
}

function addQuizToPublic() {

}

// Page component.

/**
 * The GenerateQuiz component.
 * @returns {JSX.Element}
 */
export function GenerateQuiz() {

    // The available amount options.
    let amountsKeys = [], amountsObj = {}
    for (let i = 1; i < 11; i++) {amountsKeys.push(i.toString())}
    const [ amounts, setAmounts ] = useState(amountsKeys)

    // The available difficulty options.
    const [ difficulties ] = useState(['easy', 'medium', 'hard'])

    // The available type options.
    const [ types ] = useState(['multiple'])

    // Fetches all current available categories from the API.
    const { get, response } = useFetch('https://opentdb.com')
    const [ categories, setCategories ] = useState(null)
    async function fetchAvailableCategories() {
        const skeleton = '/api_category.php?'
        const query = skeleton
        const qR = await get(query)

        let categories = []
        if (response.ok) {
            qR.trivia_categories.forEach(category => {categories.push(category)})
            let categoriesObj = {}
            for (let i = 0; i < categories.length; i++) {
                categoriesObj[categories[i].id] = categories[i].name
            }
            setCategories(categoriesObj)
        }
    }

    // Grabs all available categories on load.
    useEffect(() => {fetchAvailableCategories()}, [])

    // When all categories have loaded.
    useEffect(() => {
        if (categories) {
            console.log("Loaded categories.")
        }
    }, [categories])

    return (
        <div className={"generate-quiz-background"}>
            <div>
                <SubmitQuizFormButton categories={categories}/>
                <LinkToHome/>
            </div>
            <div className={"c"}>
                <QuizParameterForm label={"Amount"} content={amounts? amounts : []}/>
                <QuizParameterForm label={"Category"} content={categories? categories : []}/>
                <QuizParameterForm label={"Difficulty"} content={difficulties? difficulties : []}/>
                <QuizParameterForm label={"Type"} content={types? types : []}/>
            </div>
        </div>
    )
}