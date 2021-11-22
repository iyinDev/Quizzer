import './public/App.css'
import './public/quiz.css'
import './public/generate-quiz.css'
import './public/home.css'
import './public/login.css'

import { Quiz } from "./components/quiz";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {Login} from "./components/login";
import {PrivateRoute} from "./components/routes";
import {GenerateQuiz} from "./components/generate-quiz";
import {Home} from "./components/home.js";
import {getAuth, setPersistence, browserSessionPersistence, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = require("./utils/firebase-config.json")
const app = initializeApp(firebaseConfig)

function AppContent() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    return (
        <Routes>

            <Route path="/quiz/:id/:amount/:category/:difficulty/:type" element={
                <PrivateRoute>
                    <Quiz/>
                </PrivateRoute>}>
            </Route>

            <Route path={"/login"} element={<Login/>}/>

            <Route path="/quiz" element={
                <PrivateRoute>
                    <GenerateQuiz/>
                </PrivateRoute>
            }/>

            <Route path="/home" element={
                <PrivateRoute>
                    <Home/>
                </PrivateRoute>
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
            <AppContent/>
        </Router>
    );
}

export default App;
