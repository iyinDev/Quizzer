import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import useFetch from "use-http";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, query, getFirestore, orderBy, limit} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {MultipleChoiceQuestionBucket} from "./quiz";
import {useModal} from "react-modal-hook";
import {Modal} from "../utils/modal";
import {LoginForm} from "../utils/form";


const firebaseConfig = require("../utils/firebase-config.json")
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)


function Leader({ value, index }) {
    return (
        <div className={"leader card " + index}>
            <div className={"leader-pos"}>{parseInt(index[1]) + 1}.</div>
            <div className={"leader-name"}>{value.user}</div>
            <div className={"leader-score"}>{value.score}</div>
        </div>
    )
}

function Leaderboard() {
    const leaderboard = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(5))
    const [values, loading, error] = useCollectionData(leaderboard)

    function Leaders() {
        return (
            <div>
                <Leader value={values[0]} index={"l" + 0}/>
                <Leader value={values[1]} index={"l" + 1}/>
                <Leader value={values[2]} index={"l" + 2}/>
                <Leader value={values[3]} index={"l" + 3}/>
                <Leader value={values[4]} index={"l" + 4}/>
            </div>
        )
    }

    return (
        <div>
            <div className={"leaderboard-label"}>LEADERBOARD</div>
            <div className={"leaderboard-background"}>
                {values? <Leaders/> : <div/>}
            </div>
        </div>
    )
}

function PublicQuizLink({ value, currentPublicQuiz }) {
    const ref = useRef()
    const [current, setCurrent] = currentPublicQuiz

    const [timestamp, setTimestamp] = useState(new Date(value.createdAt.seconds * 1000))

    function handler() {
        setCurrent(ref)
    }

    useEffect(() => {
        if (current === ref) {
            ref.current.disabled = "true"
            ref.current.style.background = "var(--pentary)"
        } else {
            ref.current.style.background = "#FFD53D"
        }
    }, [current])

    return (
        <div ref={ref} id={value.qid} className={"public-quiz"} onClick={handler}>

            {value.createdBy.toUpperCase()} - {value.score}
            <div className={"timestamp"}>{timestamp.toDateString()}</div>
            <div className={"category-stamp"}>CATEGORY: {value.data[0].category.toUpperCase()}</div>
        </div>
    )
}

function ChallengeQuizLink({ value, currentChallengeQuiz }) {
    const ref = useRef()
    const [current, setCurrent] = currentChallengeQuiz

    const [timestamp, setTimestamp] = useState(new Date(value.createdAt.seconds * 1000))

    function handler() {
        setCurrent(ref)
    }

    useEffect(() => {
        if (current === ref) {
            ref.current.disabled = "true"
            ref.current.style.background = "var(--pentary)"
        } else {
            ref.current.style.background = "#FFD53D"
        }
    }, [current])

    return (
        <div ref={ref} id={value.qid} className={"public-quiz"} onClick={handler}>
            {value.title}
            <div className={"timestamp"}>{timestamp.toDateString()}</div>
        </div>
    )
}

function PublicQuizzes() {
    const navigate = useNavigate()
    const currentPublicQuiz = useState(null), [current, setCurrent] = currentPublicQuiz

    const publicQuizzes = query(collection(db, "public-quizzes"), orderBy('score', 'desc'), limit(5))
    const [values, loading, error] = useCollectionData(publicQuizzes)

    const [quizzes, setQuizzes] = useState(null)

    useEffect(() => {
        if (values) {
            let allQuizzes = {}
            values.forEach(value => {
                allQuizzes[value.qid] = value
            })
            setQuizzes(allQuizzes)
        }
    }, [values])

    function loadQuiz() {
        if (current) {
            const value = quizzes[current.current.id]
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
    }

    return (
        <div className={"public-card"}>
            <div className={"public-label"}>PUBLIC QUIZZES!</div>
            <button className={"play-quiz"} onClick={loadQuiz}/>
            <div className={"public-quiz-list"}>
                {values && values.map(value => <PublicQuizLink value={value} currentPublicQuiz={currentPublicQuiz}/>)}
            </div>
        </div>
    )
}

function ChallengeQuizzes() {
    const currentChallengeQuiz = useState(null), [current, setCurrent] = currentChallengeQuiz
    const navigate = useNavigate()

    const publicQuizzes = query(collection(db, "challenge-quizzes"))
    const [values, loading, error] = useCollectionData(publicQuizzes)

    const [quizzes, setQuizzes] = useState(null)

    useEffect(() => {
        if (values) {
            let allQuizzes = {}
            values.forEach(value => {
                allQuizzes[value.qid] = value
            })
            setQuizzes(allQuizzes)
        }
    }, [values])

    function loadQuiz() {
        if (current) {
            const value = quizzes[current.current.id]
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
    }

    return (
        <div className={"challenge-card"}>
            <div className={"challenge-label"}>CHALLENGE QUIZZES!</div>
            <button className={"play-quiz"} onClick={loadQuiz}/>
            <div className={"challenge-quiz-list"}>
                {values && values.map(value => <ChallengeQuizLink value={value} currentChallengeQuiz={currentChallengeQuiz}/>)}
            </div>
        </div>
    )
}

function Profile({ showModal }) {
    const auth = getAuth()

    return (
        <div className={"profile"}>
            <div className={"profile-logo-c"}>
                <div className={"profile-logo"}>{auth.currentUser.displayName? auth.currentUser.displayName[0] : ""}</div>
            </div>
            <div className={"profile-user"}>Hi, {auth.currentUser.displayName? auth.currentUser.displayName.split(" ")[0] : ""}!</div>
            <LogoutButton/>
            <button onClick={showModal} className={"card settings"}>SETTINGS</button>
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
        <button className={"card logout"} onClick={logoutHandler}>LOGOUT</button>
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
        navigate(quizRoute, {state: {initialTime: ((amount === '')? 100000 : amount * 10000)}})
        console.log("Quiz route. -> " + quizRoute)
    }

    return (
        <button className={"card submit-quiz-form"} type={"submit"} value={"Submit"} onClick={submitForm}>Submit</button>
    )
}

/**
 * The Home page component.
 * @returns {JSX.Element}
 */
export function Home() {
    // The available amount options.
    let amountsKeys = [], amountsObj = {}
    for (let i = 40; i > 0; i--) {amountsKeys.push(i.toString())}
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