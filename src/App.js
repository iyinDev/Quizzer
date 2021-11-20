import './public/App.css';
import {getQuestions} from "./services/quiz";
import {useEffect, useState} from "react";
import {Quiz} from "./components/Quiz";

function App() {

    return (
    <div className="App">
        <Quiz amount={'10'} type={'multiple'} difficulty={"easy"}/>
    </div>
    );
}

export default App;
