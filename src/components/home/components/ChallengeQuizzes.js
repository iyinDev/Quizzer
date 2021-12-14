import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {collection, getFirestore, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {BucketMCQ} from "../../quiz/utils/bucket";
import {generateQuizPath} from "../../quiz/utils/utils";
import {useEffect, useRef, useState} from "react";
import {instance} from "firebase-functions/lib/providers/database";


function ChallengeQuizLink({ value, currentChallengeQuiz }) {
    const ref = useRef()
    const [current, setCurrent] = currentChallengeQuiz

    const [timestamp] = useState(new Date(value.createdAt.seconds * 1000))

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

export function ChallengeQuizzes() {
    const auth = getAuth()

    const currentChallengeQuiz = useState(null), [current] = currentChallengeQuiz
    const navigate = useNavigate()

    const db = getFirestore()
    const publicQuizzes = query(collection(db, "challenge-quizzes"))
    const [values,] = useCollectionData(publicQuizzes)

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

                quiz.push(new BucketMCQ({
                    question: q.question,
                    category: q.category,
                    difficulty: q.difficulty,
                    correct_answer: q.correctAnswer,
                    incorrect_answers: incorrect
                }))
            })
            navigate("/quiz/" + generateQuizPath(),
                {
                    state: {
                        quiz: quiz,
                        initialTime: quiz.length * window.$SECONDS_PER_QUESTION
                    }
                }
            )

        }
    }


    return (
        <div className={"challenge-card card"}>
            <div className={"challenge-label"}>CHALLENGE QUIZZES!</div>
            <button className={"play-quiz"} onClick={loadQuiz}/>
            <div className={"challenge-quiz-list"}>
                {values && values.map(value => <ChallengeQuizLink key={value.qid} value={value} currentChallengeQuiz={currentChallengeQuiz}/>)}
            </div>
        </div>
    )
}