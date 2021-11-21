import fetch from "node-fetch";

export async function fetchSessionToken() {
    const response = await fetch('https://opentdb.com/api_token.php?command=request'), data = await response.json()
    return data.token
}

export async function fetchCategories() {
    const response = await fetch('https://opentdb.com/api_category.php'), data = await response.json()
    return data.trivia_categories
}
