import {Navigate} from 'react-router-dom'
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

