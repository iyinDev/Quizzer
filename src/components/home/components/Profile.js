import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";

export function Profile({ showModal }) {
    const auth = getAuth()

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
                console.log("User signed out. -> " + lastUser)
                if (!auth.currentUser) {
                    navigate("/login")
                }
            }).catch((error) => {
                console.log("Sign out error. -> " + error)
            })
        }

        return (
            <button className={"card logout"} onClick={logoutHandler}>LOGOUT</button>
        )
    }

    return (
        <div className={"profile"}>
            <div className={"profile-logo-c"}>
                <div className={"profile-logo"}>{auth.currentUser.displayName? auth.currentUser.displayName[0] : ""}</div>
            </div>
            <div className={"profile-user"}>Hi, {auth.currentUser.displayName? auth.currentUser.displayName.split(" ")[0] : ""}!</div>
            <LogoutButton/>
            <button onClick={showModal} className={"card settings"}>SETTINGS</button>
        </div>
    )
}