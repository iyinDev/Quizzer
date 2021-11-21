import {useNavigate} from "react-router-dom";

export function ConfigureQuizButton() {
    const navigate = useNavigate()

    function handler() {
        navigate("/quiz")
    }

    return (
        <button className={"route-switch play"} onClick={handler}>PLAY</button>
    )
}