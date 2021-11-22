import {Link, Navigate} from 'react-router-dom'
import {getAuth} from "firebase/auth";

/**
 * Child elements in route of this div are inaccessible unless navigated to.
 * @param children The child elements of the PrivateRoute.
 * @returns {*|JSX.Element}
 */
export function PrivateRoute({ children }) {
    const auth = getAuth()
    return auth.currentUser? children : <Navigate to={"/login"}/>
}


/**
 * A button that links the user to a page.
 * @param label The label of the button.
 * @param to The directory of the navigation destination.
 * @returns {JSX.Element}
 */
export function RouteLink({ label, to }) {
    return (
        <Link to={to}>
            <button className={"route-switch"} >{label}</button>
        </Link>
    )
}

/**
 * A button that links to the Home component.
 * @returns {JSX.Element}
 */
export function LinkToHome() {
    const auth = getAuth()

    return (
        <RouteLink to={"/home"} label={"Home"}/>
    )
}