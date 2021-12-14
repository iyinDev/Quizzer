import {collection, getFirestore} from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import {useEffect, useState} from "react";
import {Player} from "../../../utils/classes/Player";
import {useNavigate} from "react-router-dom";

export function InputQID({ inputState, displayNameState }) {
    const [input, setInput] = inputState
    const [displayName, setDisplayName] = displayNameState
    const [currentQuizzes, setCurrentQuizzes] = useState([])

    const navigate = useNavigate()

    const db = getFirestore()
    const [value,] = useCollection(collection(db, 'live-quizzes'))
    useEffect(() => {
        let allQuizzes = {}
        if (value) {
            value.docs.forEach(doc => {
                allQuizzes[doc.id] = doc.data().running
            // setCurrentQuizzes({quizzes})
            })
        }
        setCurrentQuizzes(allQuizzes)
    }, [value])

    // useEffect(() => {
    //     if (currentQuizzes) {
    //         console.log(currentQuizzes)
    //     }
    // }, [currentQuizzes])

    function handleInput(e) {
        e.preventDefault();
        setInput(e.target.value)
    }

    function handleDisplayName(e) {
        e.preventDefault()
        setDisplayName(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (input in currentQuizzes && !currentQuizzes[input]) {
            console.log("Joining Quiz " + input + ".")
            const livePlayer = new Player(displayName)
            navigate('/quiz/live/' + input, {
                state: {...livePlayer.user}
            })
        } else if (input.length === 6) {
            console.log("Quiz is not joinable.")
        } else {
            console.log("Invalid input.")
        }

    }

    return (
        <div>
            <form>
                <label> Join Code </label>
                <input value={input} onChange={handleInput} style={{textTransform: 'uppercase'}}/>

                <label> Display Name </label>
                <input value={displayName} onChange={handleDisplayName}/>
            </form>
            <input type={'submit'} onClick={handleSubmit}/>
        </div>
    )
}