import './public/App.css'
import './public/quiz.css'
import './public/generate-quiz.css'
import './public/home.css'
import './public/login.css'

import {initializeApp} from "firebase/app";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ModalProvider } from "react-modal-hook";

import {PrivateRoute} from "./utils/components/PrivateRoute";
import {APIQuiz} from "./components/quiz/APIQuiz";
import {QuizzerHome} from "./components/home/QuizzerHome";
import {QuizzerLogin} from "./components/login/QuizzerLogin";
import {LiveQuiz} from "./components/quiz/LiveQuiz";
import {QuizzerJoin} from "./components/join/QuizzerJoin";
import {customAlphabet} from "nanoid";

window.$SECONDS_PER_QUESTION = 5000
window.$SECONDS_PER_QUESTION_LIVE = 20 * 1000
window.$ID_GENERATOR = customAlphabet("BCDFGHJKLMNPQRSTVWYZ12567890", 6)

const firebaseConfig = require("./utils/firebase-config.json")
initializeApp(firebaseConfig)

function AppContent() {
    return (
        <Routes>

            <Route path="/quiz/:qid" element={
                <PrivateRoute>
                    <APIQuiz/>
                </PrivateRoute>}>
            </Route>

            {/*<Route path="/quiz/:qid/:uid/:instance" element={*/}
            {/*    <PrivateRoute>*/}
            {/*        <FirestoreQuiz/>*/}
            {/*    </PrivateRoute>}>*/}
            {/*</Route>*/}

            {/*<Route path="/quiz/live/:qid/" element={*/}
            {/*    <LiveQuiz/>*/}
            {/*}/>*/}

            {/*<Route path={"/join"} element={*/}
            {/*    <QuizzerJoin/>*/}
            {/*}/>*/}

            <Route path="/home" element={
                <PrivateRoute>
                    <QuizzerHome/>
                </PrivateRoute>
            }/>

            <Route path={"/login"} element={
                <QuizzerLogin/>
            }/>

            <Route path={"/"} element={
                <Navigate to={"/home"}/>
            }/>

        </Routes>
    )
}

function App() {

   return (
        <Router>
            <ModalProvider>
                <AppContent/>
            </ModalProvider>
        </Router>
    );
}

export default App;
