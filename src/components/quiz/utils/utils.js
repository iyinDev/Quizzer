import {BucketMCQ} from "./bucket";
import {customAlphabet} from "nanoid";

export function loadQuizFromQuery(response, query) {
    let responseQuestions = []
    if (response.ok) {
        query.results.forEach(question => {
            let mcq = new BucketMCQ(question)
            responseQuestions.push(mcq)
        })
    }
    return responseQuestions
}

export function generateQuizPath(instance=null) {
    const nanoid = customAlphabet("BCDFGHJKLMNPQRSTVWYZ12567890", 6)

    return nanoid() + (instance? "/" + nanoid() : "")
}

export function generateDefaultQuizSummary (displayName) {
    return {
        points: 0,
        incorrectCount: 0,
        correctCount: 0,
        totalCount: 0,
        displayName: displayName,
    }
}