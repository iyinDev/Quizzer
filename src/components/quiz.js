import {useEffect, useRef, useState} from "react";
import {useFetch} from "use-http";
import {useParams} from "react-router-dom";
import useCountDown from "react-countdown-hook";
import {LinkToHome} from "./routes";

// Quiz helper classes and functions.

/**
 * Decodes input from API.
 * @param input String from API response.
 * @returns {string}
 */
function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

/**
 * Shuffles an array.
 * @param array
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/**
 * An Object to store the information to display a multiple choice question.
 */
class MultipleChoiceQuestionBucket {
    constructor({ question, category, difficulty, correct_answer, incorrect_answers }) {
        this.question = htmlDecode(question)
        this.category = category
        this.difficulty = difficulty

        const allChoices = [htmlDecode(correct_answer)]
        incorrect_answers.forEach(answer => {
            allChoices.push(htmlDecode(answer))
        })
        this.correctAnswer = allChoices[0]
        shuffleArray(allChoices)
        this.choices = {
            A: allChoices[0],
            B: allChoices[1],
            C: allChoices[2],
            D: allChoices[3]
        }
    }
}


// Quiz components.

/**
 * Displays on MultipleChoiceQuestionBucket.
 * @returns {JSX.Element}
 */
function MultipleChoiceQuestion({ scre, mcq, usrAnswrs, indx }) {
    const ref = useRef()
    const [ currentChoice, setCurrentChoice ] = useState(null), curr = {currentChoice: currentChoice, setCurrentChoice: setCurrentChoice}
    const [running, setRunning] = useState(false), rnning = {running: running, setRunning: setRunning}

    return (
        <div>
            <div ref={ref} className={"question"}>
                <div id={"question-card"} className={"question-card"}>{mcq? mcq.question : ""}
                    <ChoiceEvaluator answer={mcq? mcq.correctAnswer : null} curr={curr} usrAnswrs={usrAnswrs} indx={indx} rnning={rnning} scre={scre}/>
                </div>
                <ProgressBar rnning={rnning}/>
            </div>
            <div className={"choices"}>
                <ChoiceMCQ mcq={mcq} choiceClass={"A"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} choiceClass={"B"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} choiceClass={"C"} curr={curr}/>
                <ChoiceMCQ mcq={mcq} choiceClass={"D"} curr={curr}/>
            </div>
            {/*<div>{props.mcq? props.mcq.correctAnswer : ""}</div>*/}
        </div>
    )
}

/**
 * The Multiple Choice Question Choice component.
 * @returns {JSX.Element}
 */
function ChoiceMCQ({ mcq, curr, choiceClass }) {
    const { currentChoice, setCurrentChoice } = curr

    const ref = useRef()

    // Adjusts text size based on string length.
    useEffect(() => {
        if (mcq) {
            const text = mcq.choices[choiceClass]
            if (text) {
                if (text.length >= 30) {
                    ref.current.style.fontSize = "4vmin"
                } else if (text.length < 30 && text.length >= 15 ) {
                    ref.current.style.fontSize = "4.5vmin"
                } else {
                    ref.current.style.fontSize = "7vmin"
                }
            }
        }
    }, [mcq])

    // Applies the "current" effect on a selected Choice component.
    useEffect(() => {
        if (curr) {
            if (ref === currentChoice) {
                ref.current.className = "current " + choiceClass
            } else {
                ref.current.className = choiceClass
            }
        }
    }, [curr])

    /**
     * Sets ref as the currentChoice state.
     */
    const choiceMCQHandler = () => {
        setCurrentChoice(ref)
    }

    return (
        <button ref={ref} onClick={choiceMCQHandler} className={choiceClass}>{mcq? mcq.choices[choiceClass] : ""}</button>
    )
}

/**
 * The progress bar at the bottom of the question card.
 * @returns {JSX.Element}
 */
function ProgressBar({ rnning }) {
    const ref = useRef()

    const { running, setRunning } = rnning

    const initialTime = 1 * 60 * 1000
    const interval = 1000
    const [timeLeft, { start, reset }] = useCountDown(initialTime, interval)

    /**
     * Display the results modal.
     */
    function displayResults() {
        ref.current.style.width = '0'
        document.getElementById('question-card').style.background = "indianred"
        setTimeout(() => {
            document.getElementById('results').style.display = "block"
        }, 200)
    }

    // Starts the timer on load.
    useEffect(() => {
        start()
        setRunning(true)
    }, [])

    // Checks if the timer has completed or is still running to display results.
    useEffect(() => {
        if (timeLeft === 0 && running) {
            console.log("Timer done.")
            setRunning(false)
            displayResults()
        } else if (timeLeft !== 0 && !running) {
            reset()
            displayResults()
        } else {
            ref.current.style.width = ((timeLeft / initialTime) * 100) + "%"
            ref.current.style.width = ((timeLeft / initialTime) * 100) + "%"
        }

    }, [timeLeft, running])

    return(
        <div className={"question-progress-background"}>
            <div ref={ref} className={"question-progress"}/>
        </div>

    )
}


// Quiz component button.

/**
 * The Score component.
 * @returns {JSX.Element}
 */
function Score({ scre }) {
    const { score } = scre
    const ref = useRef()

    return (
        <div ref={ref} className={"score"}>YOUR SCORE: {score}</div>
    )
}


// Quiz buttons.

/**
 * The button to check a choice and move to the next question.
 * @returns {JSX.Element}
 */
function ChoiceEvaluator({ indx, curr, answer, usrAnswrs, rnning, scre}) {
    const { running, setRunning } = rnning
    const { score, setScore } = scre
    const ref = useRef()

    const { index, setIndex, n } = indx
    const { currentChoice, setCurrentChoice } = curr
    const { userAnswers, setUserAnswers } = usrAnswrs

    /**
     * Moves to next question or ends quiz if last question has been answered.
     */
    function nextQuestion() {
        if (index + 1 < n) {
            setIndex(index => index + 1)
            setCurrentChoice(null)
        } else {
            if (running) {
                setRunning(false)
            }
        }
    }

    /**
     * Compares the current choice to the question answer, and scores.
     */
    function choiceEvaluatorHandler() {
        let correct
        if (!currentChoice) {
            console.log("No answer selected.")
            correct = null
        } else if (currentChoice.current.innerHTML === answer) {
            console.log("Correct answer.")
            correct = true
            setUserAnswers([...userAnswers, true])
            setScore(score => score + 1)
        } else {
            console.log("Incorrect answer.")
            correct = false
            setUserAnswers([...userAnswers, false])
        }
        if (correct != null) {
            nextQuestion()
        }
    }

    return (
        <button ref={ref} onClick={choiceEvaluatorHandler} className={"check"}/>
    )
}


// Page components.

/**
 * The Results Modal.
 * @returns {JSX.Element}
 */
function Results({ usrAnswrs, index }) {
    const ref = useRef()
    const [scoreMessage, setScoreMessage] = useState([])

    const { userAnswers } = usrAnswrs
    const { n } = index

    // Displays scoreMessage.
    useEffect(() => {
        let count = 0
        userAnswers.forEach(answer => count += (answer === true? 1 : 0))
        const fraction = count + "/" + n + "!"
        setScoreMessage('YOU SCORED: ' + fraction)
    }, [userAnswers])

    return (
        <div ref={ref} id={"results"} className={"results-background"}>
            <div className={"results-container"}>
                <div className={"results"}>{scoreMessage}</div>
                <LinkToHome/>
            </div>
        </div>
    )
}

/**
 *  The Quiz page component.
 * @returns {JSX.Element}
 */
export function Quiz() {
    const { amount, category, difficulty, type, id } = useParams()

    const { get, response } = useFetch('https://opentdb.com')

    const uid = useState(id)
    const [ questions, setQuestions ] = useState([])
    const [ userAnswers, setUserAnswers ] = useState([]), usrAnswrs = {userAnswers: userAnswers, setUserAnswers: setUserAnswers}
    const [ index, setIndex ] = useState(0), indx = {index: index, setIndex: setIndex, n: amount}
    const [ score, setScore ] = useState(0), scre = {score: score, setScore: setScore}

    /**
     * Makes the query API to load quiz data.
     * @returns {Promise<void>}
     */
    async function initializeQuiz() {
        const skeleton = '/api.php?'
        const query = skeleton
            + (amount? "&amount=" + amount : "")
            + (category? "&category=" + category : "")
            + (difficulty? "&difficulty=" + difficulty : "")
            + (type? "&type=" + type : "")
        const qR = await get(query)

        if (response.ok) {
            let responseQuestions = []
            qR.results.forEach(question => {
                let mcq = new MultipleChoiceQuestionBucket(question)
                responseQuestions.push(mcq)
            })
            setQuestions(responseQuestions)
        }
    }

    // Makes API GET request to initialize quiz questions.
    useEffect(() => {
        initializeQuiz()
    }, [])

    // If userAnswers changes.
    useEffect(() => {
        if (userAnswers) {
            console.log('User answers. -> ' + userAnswers)
        }
    }, [userAnswers])

    return (
            <div>
                <Results usrAnswrs={usrAnswrs} index={indx}/>
                <div className={"quiz"}>
                    <Score scre={scre}/>
                    <span className={"logo"}>QUIZZER!</span>
                    <MultipleChoiceQuestion mcq={questions[index]} usrAnswrs={usrAnswrs} indx={indx} scre={scre}/>
                </div>
            </div>
    )
}