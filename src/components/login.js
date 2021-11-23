import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";

// Login component buttons.

/**
 * A button that logs in a current user.
 * @returns {JSX.Element}
 */
export function LoginButton() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider();

    /**
     * Logs in the current user.
     */
    function loginHandler() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log("User signed in. -> " + user.email)
                // ...
            }).catch((error) => {
            const errorMessage = error.message;
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log("Error. -> "  + errorMessage + " -> " + email)
            // ...
        });
    }

    return (
        <button className={"login-button"} onClick={loginHandler}>Login</button>
    )
}


// Page component.

/**
 * The Login page component.
 * @returns {JSX.Element}
 */
export function Login() {

    const auth = getAuth()
    const [user] = useAuthState(auth)

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
            {user? <Navigate to={"/home"}/> : <Page/>}
        </div>
    )
}