import {BucketMCQ} from "./bucket";

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

export function createRandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+ S4() + "-" + S4())
}

export function generateQuizPath(auth, instance=null) {
    return createRandomID() + "/" + auth.currentUser.uid.substring(0, 6) + (instance? "/" + createRandomID() : "")
}