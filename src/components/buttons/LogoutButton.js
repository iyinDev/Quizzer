import {getAuth, signOut} from "firebase/auth";

export function LogoutButton() {
    const auth = getAuth()

    function logoutHandler() {
        signOut(auth).then(() => console.log(auth.currentUser.email + " just signed out.")).catch(() => console.log("Sign out error."))
    }

    return (
        <button className={"route-switch logout"} onClick={logoutHandler}>Logout</button>
    )
}