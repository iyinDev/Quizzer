import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";

// Home component buttons.

/**
 * A button that logs out the current user.
 * @returns {JSX.Element}
 */
function LogoutButton() {
    const auth = getAuth()
    const navigate = useNavigate()

    /**
     * Logs out the current user.
     */
    function logoutHandler() {

        const lastUser = auth.currentUser.email
        signOut(auth).then(() => {
            console.log(lastUser + " just signed out.")
            if (!auth.currentUser) {
                navigate("/login")
            }
        }).catch((error) => {
            console.log("Sign out error. -> " + error)
        })
    }

    return (
        <button className={"route-switch logout"} onClick={logoutHandler}>Logout</button>
    )
}

/**
 * A button to navigate to the GenerateQuiz component.
 * @returns {JSX.Element}
 */
function ConfigureQuizButton() {
    const navigate = useNavigate()

    /**
     * Navigates to the GenerateQuiz component.
     */
    function configureQuizButtonHandler() {
        navigate("/quiz")
    }

    return (
        <button className={"route-switch play"} onClick={configureQuizButtonHandler}>PLAY</button>
    )
}


// Page component.

/**
 * The Home page component.
 * @returns {JSX.Element}
 */
export function Home() {

    return (
        <div className={"home-background"}>
            <div className={"home-logo"}>
                <span>QUIZZER!</span>
            </div>
            <div className={"home-buttons"}>
                <ConfigureQuizButton/>
                <LogoutButton/>
            </div>
        </div>
    )
}