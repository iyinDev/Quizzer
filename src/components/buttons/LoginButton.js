import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

export function LoginButton() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider();

    function loginHandler() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(user.email + " just signed in.")
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