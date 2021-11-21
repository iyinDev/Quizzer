import "../../../public/generate-quiz.css"
import {QuizParameterForm} from "./QuizParameterForm";
import {SubmitQuizFormButton} from "../../buttons/SubmitQuizFormButton";
import {LinkToHome} from "../../buttons/RouteLink";
import {useEffect, useState} from "react";
import {useFetch} from "use-http";

export function GenerateQuiz() {
    const [ categories, setCategories ] = useState(null)

    let amountsKeys = [], amountsObj = {}
    for (let i = 1; i < 11; i++) {amountsKeys.push(i.toString())}
    amountsKeys.forEach(key => amountsObj[key] = key)
    const [ amounts, setAmounts ] = useState(amountsObj)

    const [ difficulties ] = useState({
        easy: 'easy',
        medium: 'medium',
        hard: 'hard'
    })

    const [ types ] = useState({
        multiple: 'multiple'
    })

    const { get, response } = useFetch('https://opentdb.com')

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

    useEffect(() => {fetchAvailableCategories()}, [])

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