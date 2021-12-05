import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";

/**
 * The Multiple Choice Question Choice component.
 * @returns {JSX.Element}
 */
function Choice({ question, choiceClass, answeredState, correctState, choicesState, timeState, summaryState }) {
    const ref = useRef()
    const { state } = useLocation()

    const [, setAnswered ] = answeredState
    const [ correct, setCorrect ] = correctState
    const [choices, setChoices] = choicesState
    const [, setQuizSummary ] = summaryState

    useEffect(() => setChoices(choices => ({...choices, [choiceClass]: ref})), [])

    useEffect(() => {if (question && question.choices[choiceClass] === question.correctAnswer) setCorrect(choiceClass)}, [question])

    // Adjusts text size based on string length.
    useEffect(() => {
        if (question) {
            const text = question.choices[choiceClass]
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
    }, [choiceClass, question])

    /**
     * Answers and scores question.
     */
    function scoreChoice() {
        const [ timeLeft ] = timeState
        const timeFactor = timeLeft / state.initialTime

        let points
        if (question.difficulty === 'hard') {
            points = Math.floor(20 + (15 * timeFactor))
        } else if (question.difficulty === 'medium') {
            points = Math.floor(15 + (15 * timeFactor))
        } else {
            points = Math.floor(10 + (15 * timeFactor))
        }
        return points
    }

    function choiceHandler() {
        setAnswered(true)
        if (choiceClass === correct) {
            ref.current.className = choiceClass + " current"
            for (let choice in choices) {
                if (choice !== choiceClass) {
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " other"
                }
            }
            const points = scoreChoice()
            setQuizSummary(quizSummary => ({...quizSummary,
                points: quizSummary.points + points,
                correctCount: quizSummary.correctCount + 1,
                totalCount: quizSummary.totalCount + 1
            }))
        }
        else {
            for (let choice in choices) {
                if (choice !== correct && choice !== choiceClass) {
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " other"
                } else if (choice === choiceClass){
                    choices[choice].current.disabled = true
                    choices[choice].current.className = choiceClass + " incorrect-choice"
                } else {
                    choices[choice].current.className = choiceClass + " current"
                }
            }
            setQuizSummary(quizSummary => ({...quizSummary,
                incorrectCount: quizSummary.incorrectCount + 1,
                totalCount: quizSummary.totalCount + 1
            }))
        }
    }

    return (
        <button ref={ref} onClick={choiceHandler} className={choiceClass}>{question? question.choices[choiceClass] : ""}</button>
    )
}

/**
 * The progress bar at the bottom of the question card.
 * @returns {JSX.Element}
 */
function ProgressBar({ rnning, time }) {
    const ref = useRef()

    const [ running, setRunning ] = rnning

    const { state } = useLocation()
    const [timeLeft, { start, reset }] = time
    // const [timeLeft, { start, reset }] = useCountDown(state.initialTime, 1000)

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

    useEffect(() => {
        start()
        setRunning(true)
    }, [])

    // Checks if the timer has completed or is still running to display results.
    useEffect(() => {
        if (timeLeft === 0 && running) {
            console.log("Timer done.")
            setRunning(false)
        } else if (timeLeft !== 0 && !running) {
            reset()
        } else {
            ref.current.style.width = ((timeLeft / state.initialTime) * 100) + "%"
        }

    }, [timeLeft, running, setRunning, reset, state.initialTime])

    return(
        <div className={"question-progress-background"}>
            <div ref={ref} className={"question-progress"}/>
        </div>

    )
}

/**
 * The button to check a choice and move to the next question.
 * @returns {JSX.Element}
 */
function NextQuestion({ indx, answeredState, rnning}) {
    const ref = useRef()
    const [ running, setRunning ] = rnning, [index, setIndex]  = indx, [ ,setAnswered ] = answeredState

    const { state } = useLocation()

    /**
     * Moves to next question or ends quiz if last question has been answered.
     */
    function nextQuestion() {
        setAnswered(null)
        if (index + 1 < state.quiz.length) {
            setIndex(index => index + 1)
        } else {
            if (running) {
                setRunning(false)
            }
        }
    }

    return (
        <button ref={ref} onClick={nextQuestion} className={"check card"}/>
    )
}
/**
 * Displays on MultipleChoiceQuestionBucket.
 * @returns {JSX.Element}
 */
export function Question({ question, indexState, timeState, runningState, summaryState }) {
    const ref = useRef()

    const answeredState = useState(null), [answered] = answeredState
    const correctState = useState(null)
    const choicesState = useState({
        A: null,
        B: null,
        C: null,
        D: null
    }), [choices] = choicesState

    useEffect(() => {
        if (!answered) {
            Object.keys(choices).forEach(key => {
                if (choices[key]) {
                    choices[key].current.className = "choice"
                    choices[key].current.disabled = false
                }
            })
        }
    }, [answered])

    return (
        <div>
            <div ref={ref} className={"question"}>
                <div id={"question-card"} className={"question-card"}>{question? question.question : ""}
                    <NextQuestion answer={question? question.correctAnswer : null} answeredState={answeredState} indx={indexState} rnning={runningState}/>
                </div>
                <ProgressBar rnning={runningState} time={timeState}/>
            </div>
            <div className={"choices"}>
                {choices && Object.keys(choices).map(key => <Choice question={question} choiceClass={key} answeredState={answeredState} correctState={correctState} choicesState={choicesState} timeState={timeState} summaryState={summaryState}/>)}
            </div>
        </div>
    )
}