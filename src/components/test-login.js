import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";

export function TestLogin() {
    const auth = getAuth()
    const [user] = useAuthState(auth)
    const provider = new GoogleAuthProvider();

    function login() {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    function logout() {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Signed out.", auth)
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
        console.log(user, auth)
    }

    return (
        <div>
            {user? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button>}
        </div>
    )
}