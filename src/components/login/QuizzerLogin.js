import {useModal} from "react-modal-hook";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {Modal} from "../../utils/modal";
import {LoginForm, RegistrationForm} from "../../utils/form";
import {Navigate} from "react-router-dom";
import {AuthWithGoogle} from "./components/AuthWithGoogle";

/**
 * The Login page component.
 * @returns {JSX.Element}
 */
export function QuizzerLogin() {
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
                    <AuthWithGoogle/>
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