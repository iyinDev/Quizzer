import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {collection, getFirestore, limit, orderBy, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {generateQuizPath} from "../../quiz/utils/utils";
import {useEffect, useRef, useState} from "react";

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
            <div className={"category-stamp"}>CATEGORY - {value.data[0].category.toUpperCase()}</div>
        </div>
    )
}

export function PublicQuizzes() {
    const auth = getAuth()
    const navigate = useNavigate()
    const db = getFirestore()

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
            navigate("/quiz/" + generateQuizPath(auth, true), {
                state:
                    {
                        quiz: quiz,
                        initialTime: quiz.length * window.$SECONDS_PER_QUESTION}
            })
        }
    }

    return (
        <div className={"public-card card"}>
            <div className={"public-label"}>PUBLIC QUIZZES!</div>
            <button className={"play-quiz"} onClick={loadQuiz}/>
            <div className={"public-quiz-list"}>
                {values && values.map(value => <PublicQuizLink value={value} currentPublicQuiz={currentPublicQuiz}/>)}
            </div>
        </div>
    )
}