import {Link, Navigate} from "react-router-dom";

export function RouteLink(props) {
    const { label, to } = props

    return (
        <Link to={to}>
            <button className={"route-switch"} >{label}</button>
        </Link>
    )
}

export function LinkToQuiz(props) {
    return (
        <RouteLink to={"/quiz"} label={"Quiz"}/>
    )
}

export function LinkToHome() {
    return (
        <RouteLink to={"/"} label={"Home"}/>
    )
}
