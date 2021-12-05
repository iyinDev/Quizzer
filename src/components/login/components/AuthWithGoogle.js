import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

export function AuthWithGoogle() {
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
        <button className={"card auth-google"} onClick={loginHandler}/>
    )
}