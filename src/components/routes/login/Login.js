import "../../../public/login.css"
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {Navigate} from "react-router-dom";
import {LoginButton} from "../../buttons/LoginButton";

export function Login() {
    const auth = getAuth()

    function Page() {
        return(
            <div>
                <div className={"home-logo login-logo"}>
                    <span>QUIZZER!</span>
                </div>
                <LoginButton/>
            </div>
        )
    }

    return (
        <div className={"login-background"}>
            {auth.currentUser? <Navigate to={"/home"}/> : <Page/>}
        </div>
    )
}