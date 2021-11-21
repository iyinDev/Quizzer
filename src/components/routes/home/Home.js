import "../../../public/home.css"
import {useNavigate} from "react-router-dom";
import {LogoutButton} from "../../buttons/LogoutButton";
import {ConfigureQuizButton} from "../../buttons/ConfigureQuizButton";

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