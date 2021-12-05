import useFetch from "use-http";
import {useEffect, useState} from "react";
import {Profile} from "./components/Profile";
import {Leaderboard} from "./components/Leaderboard";
import {ChallengeQuizzes} from "./components/ChallengeQuizzes";
import {PublicQuizzes} from "./components/PublicQuizzes";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {CreateQuizPanel, QuizInput, SubmitQuizFormButton} from "./components/QuizForm";



export function QuizzerHome() {

    function UserLeaderboardPanel() {
        return (
            <div className={"panel card"}>
                <div className={"logo-label"}>QUIZZER!</div>
                <Profile/>
                <Leaderboard/>
            </div>
        )
    }

    function CreateQuizPanel() {
        // The available amount options.
        let amountsKeys = []
        for (let i = 40; i > 0; i--) {amountsKeys.push(i.toString())}
        const [ amounts] = useState(amountsKeys)

        // The available difficulty options.
        const [ difficulties ] = useState(['easy', 'medium', 'hard'])

        // The available type options.
        const [ types ] = useState(['multiple'])

        // Fetches all current available categories from the API.
        const { get, response } = useFetch('https://opentdb.com')
        const [ categories, setCategories ] = useState(null)

        // Grabs all available categories on load.
        useEffect(() => {
            async function fetchAvailableCategories() {
                const query = '/api_category.php?'
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
            fetchAvailableCategories()
        }, [])

        // When all categories have loaded.
        useEffect(() => {
            if (categories) {
                console.log("Loaded categories.")
            }
        }, [categories])


        return (
            <div className={"create card"}>
                <div className={"create-label"}>CREATE A QUIZ!</div>
                <div className={"forms"}>
                    <QuizInput label={"Amount"} content={amounts? amounts : []}/>
                    <QuizInput label={"Category"} content={categories? categories : []}/>
                    <QuizInput label={"Difficulty"} content={difficulties? difficulties : []}/>
                    <QuizInput label={"Type"} content={types? types : []}/>
                </div>
                <SubmitQuizFormButton categories={categories}/>
            </div>
        )
    }

    function PublicPanel() {
        return (
            <div className={"public"}>
                <ChallengeQuizzes/>
                <PublicQuizzes/>
            </div>
        )
    }

    return (
        <div className={"home-background"}>
            <div className={"home"}>
                <UserLeaderboardPanel/>
                <CreateQuizPanel/>
                <PublicPanel/>
            </div>
        </div>
    )
}