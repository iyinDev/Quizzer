import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {useEffect, useRef, useState} from "react";
import useComponentVisible from "../utils/use-component-visible";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import {Modal} from "../utils/modal";
import {RegistrationForm, LoginForm} from "../utils/form";

// Login component buttons.

/**
 * A button that logs in a current user.
 * @returns {JSX.Element}
 */
export function LogInWithGoogle() {
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


// Page component.




/**
 * The Login page component.
 * @returns {JSX.Element}
 */
export function Login() {
    const visibleRegister = useComponentVisible(false)
    const [showRegisterModal, hideRegisterModal] = useModal(() => (
            <Register hideModal={hideRegisterModal}/>
        )
    )
    const [showLoginModal, hideLoginModal] = useModal(() => (
        <LoginModal hideModal={hideLoginModal}/>
    ))

    const auth = getAuth()
    const [user] = useAuthState(auth)

    /**
     * The Results Modal.
     * @returns {JSX.Element}
     */
    function Register({ hideModal }) {
        const auth = getAuth()

        return (
            <Modal header={"REGISTER"} hideModal={hideModal} size={"sm-thin"}>
                <div className={"register-input"}>
                    <RegistrationForm/>
                </div>
            </Modal>
        )
    }

    /**
     * The Login Modal.
     * @returns {JSX.Element}
     */
    function LoginModal({ hideModal }) {
        const auth = getAuth()

        return (
            <Modal header={"LOGIN"} hideModal={hideModal} size={"sm-thin"}>
                <div className={"register-input"}>
                    <LoginForm/>
                </div>
            </Modal>
        )
    }

    function Page() {
        return(
            <div>
                <div className={"card login-logo"}>
                    <span>QUIZZER!</span>
                </div>
                <div className={"auth-bts"}>
                    <button onClick={showLoginModal} className={"card auth-login"}>LOGIN</button>
                    <LogInWithGoogle/>
                    <button onClick={showRegisterModal} className={"card auth-register"}>REGISTER</button>
                </div>
                <div className={"card welcome center"}>WELCOME TO QUIZZER!</div>
            </div>
        )
    }

    return (
        <div className={"login-background"}>
            {user?
                user.displayName? <Navigate to={"/home"}/> : <Page/>
            : <Page/>}
        </div>
    )
}