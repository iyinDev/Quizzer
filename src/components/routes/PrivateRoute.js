import {Navigate, Redirect, Route} from 'react-router-dom'
import {getAuth} from "firebase/auth";

export function PrivateRoute({ children }) {
    const auth = getAuth()
    auth.currentUser? console.log(auth.currentUser.email + " is already signed in.") : console.log("Redirected to login page.")
    return auth.currentUser? children : <Navigate to={"/login"}/>
}
