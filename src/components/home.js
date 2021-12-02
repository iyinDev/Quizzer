import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import useFetch from "use-http";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, query, getFirestore, orderBy, limit} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {MultipleChoiceQuestionBucket} from "./quiz";


const firebaseConfig = require("../utils/firebase-config.json")
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function Leaderboard() {
    const leaderboard = collection(db, "leaderboard")
    const [values, loading, error] = useCollectionData(leaderboard)

    useEffect(() => {
        if (!loading) {
            console.log(values)
        }
    }, [values])

    return (
        <div>
            <div className={"leaderboard-label"}>LEADERBOARDS</div>
            <ul className={"leaderboard-background"}>
                {values && values.map(value => <li>{value.user} - {value.score}</li>)}
            </ul>
        </div>
    )
}

function PublicQuizLink({ value, currentState }) {
    const ref = useRef()

    const [mcq, setMCQ] = useState(null)
    const [timestamp, setTimestamp] = useState(new Date(value.createdAt.seconds * 1000))

    function handler() {
        currentState[1](ref)
    }

    return (
        <div className={"public-quiz"} onClick={handler}>

            {value.createdBy.toUpperCase()} - {value.score}
            <div className={"timestamp"}>{timestamp.toDateString()}</div>
            <div className={"category-stamp"}>CATEGORY: {value.data[0].category.toUpperCase()}</div>
        </div>
    )
}

function PublicQuizzes() {
    const navigate = useNavigate()
    const currentState = useState(null)

    const publicQuizzes = query(collection(db, "public-quizzes"), orderBy('score', 'desc'), limit(5))
    const [values, loading, error] = useCollectionData(publicQuizzes)

    useEffect(() => {
        
    }, [])

    function loadQuiz() {

        const quiz = []
        value.data.forEach(q => {

            const incorrect = []
            for (let i in q.choices) {
                if (q.choices[i] !== q.correctAnswer) {
                    incorrect.push(q.choices[i])
                }
            }

            const mcqData = {
                question: q.question,
                category: q.category,
                difficulty: q.difficulty,
                correct_answer: q.correctAnswer,
                incorrect_answers: incorrect
            }

            quiz.push(mcqData)
        })

        navigate("/quiz/" + value.qid, { state: quiz })
    }

    return (
        <div className={"public-card"}>
            <div className={"public-label"}>PUBLIC QUIZZES!</div>
            <button className={"play-quiz"} onClick={loadQuiz}>Play</button>
            <div>
                <ul className={"public-quiz-list"}>
                    {values && values.map(value => <PublicQuizLink value={value} currentState={currentState}/>)}
                </ul>
            </div>

        </div>
    )
}

function ChallengeQuizzes() {
    const publicQuizzes = query(collection(db, "challenge-quizzes"))
    const [values, loading, error] = useCollectionData(publicQuizzes)

    return (
        <div className={"challenge-card"}>
            <div className={"challenge-label"}>CHALLENGE QUIZZES!</div>
            <ul className={"challenge-quizzes-background"}>
                {values && values.map(value => <li>{value.title} - {value.createdAt.seconds}</li>)}
            </ul>
        </div>
    )
}

function Profile() {
    const auth = getAuth()

    return (
        <div className={"profile"}>
            <div className={"profile-logo-c"}>
                <div className={"profile-logo"}>{auth.currentUser.displayName[0]}</div>
            </div>
            <div className={"profile-user"}>Hi, {auth.currentUser.displayName.split(" ")[0]}!</div>
            <LogoutButton/>
            <button className={"settings"}>SETTINGS</button>
        </div>
    )
}

// Home component buttons.

/**
 * A button that logs out the current user.
 * @returns {JSX.Element}
 */
function LogoutButton() {
    const auth = getAuth()
    const navigate = useNavigate()

    /**
     * Logs out the current user.
     */
    function logoutHandler() {

        const lastUser = auth.currentUser.email
        signOut(auth).then(() => {
            console.log("User signed out. -> " + lastUser)
            if (!auth.currentUser) {
                navigate("/login")
            }
        }).catch((error) => {
            console.log("Sign out error. -> " + error)
        })
    }

    return (
        <button className={"logout"} onClick={logoutHandler}>LOGOUT</button>
    )
}

/**
 * A button to navigate to the GenerateQuiz component.
 * @returns {JSX.Element}
 */
function ConfigureQuizButton() {
    const navigate = useNavigate()

    /**
     * Navigates to the GenerateQuiz component.
     */
    function configureQuizButtonHandler() {
        navigate("/quiz")
    }

    return (
        <button className={"route-switch play"} onClick={configureQuizButtonHandler}>PLAY</button>
    )
}


// Page component.

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

/**
 * The button to submit a Quiz form.
 * @param categories An Object containing all available categories { id: category } ( passed from the GenerateQuiz component )
 * @returns {JSX.Element}
 */
function SubmitQuizFormButton({ categories }) {
    const navigate = useNavigate()

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

/**
 * The Home page component.
 * @returns {JSX.Element}
 */
export function Home() {

    // The available amount options.
    let amountsKeys = [], amountsObj = {}
    for (let i = 10; i > 0; i--) {amountsKeys.push(i.toString())}
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
        <div className={"home-background"}>
            <div className={"home"}>

                <div className={"panel"}>
                    <div className={"logo-label"}>QUIZZER!</div>
                    <Profile/>
                    <Leaderboard/>
                </div>

                <div className={"create"}>
                    <div className={"create-label"}>CREATE A QUIZ!</div>
                    <div className={"forms"}>
                        <QuizParameterForm label={"Amount"} content={amounts? amounts : []}/>
                        <QuizParameterForm label={"Category"} content={categories? categories : []}/>
                        <QuizParameterForm label={"Difficulty"} content={difficulties? difficulties : []}/>
                        <QuizParameterForm label={"Type"} content={types? types : []}/>
                    </div>
                    <SubmitQuizFormButton categories={categories}/>
                </div>

                <div className={"public"}>
                    <ChallengeQuizzes/>
                    <PublicQuizzes/>
                </div>
            </div>

            {/*<div className={"home-buttons"}>*/}
            {/*    <ConfigureQuizButton/>*/}
            {/*    <LogoutButton/>*/}
            {/*</div>*/}
        </div>
    )
}