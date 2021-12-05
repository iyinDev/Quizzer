import './public/App.css'
import './public/quiz.css'
import './public/generate-quiz.css'
import './public/home.css'
import './public/login.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ModalProvider } from "react-modal-hook";

import {PrivateRoute} from "./utils/components/PrivateRoute";
import {APIQueryQuiz} from "./components/quiz/APIQueryQuiz";
import {PreloadedQuiz} from "./components/quiz/PreloadedQuiz";
import {QuizzerHome} from "./components/home/QuizzerHome";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {QuizzerLogin} from "./components/login/QuizzerLogin";

window.$SECONDS_PER_QUESTION = (1/15) * 60 * 1000

const firebaseConfig = require("./utils/firebase-config.json")
const app = initializeApp(firebaseConfig)

function AppContent() {
    return (
        <Routes>

            <Route path="/quiz/:qid/:uid" element={
                <PrivateRoute>
                    <APIQueryQuiz/>
                </PrivateRoute>}>
            </Route>

            <Route path="/quiz/:qid/:uid/:instance" element={
                <PrivateRoute>
                    <PreloadedQuiz/>
                </PrivateRoute>}>
            </Route>

            <Route path="/quiz" element={
                <PrivateRoute>

                </PrivateRoute>
            }/>

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
