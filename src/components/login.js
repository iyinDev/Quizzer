import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";

// Login component buttons.

/**
 * A button that logs in a current user.
 * @returns {JSX.Element}
 */
function LoginButton() {
    const auth = getAuth()
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();

    /**
     * Logs in the current user.
     */
    function loginHandler() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(user.email + " just signed in.")
                navigate("/home")
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        })
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
    return (
        <div className={"login-background"}>
            <div className={"home-logo login-logo"}>
                <span>QUIZZER!</span>
            </div>
            <LoginButton/>
        </div>
    )
}