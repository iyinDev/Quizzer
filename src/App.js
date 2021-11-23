import './public/App.css'
import './public/quiz.css'
import './public/generate-quiz.css'
import './public/home.css'
import './public/login.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { initializeApp } from "firebase/app";

import { Quiz } from "./components/quiz";
import {Login} from "./components/login";
import {PrivateRoute} from "./components/routes";
import {GenerateQuiz} from "./components/generate-quiz";
import {Home} from "./components/home.js";

const firebaseConfig = require("./utils/firebase-config.json")
const app = initializeApp(firebaseConfig)

function AppContent() {
    return (
        <Routes>

            <Route path="/quiz/:id/:amount/:category/:difficulty/:type" element={
                <PrivateRoute>
                    <Quiz/>
                </PrivateRoute>}>
            </Route>

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

            <Route path={"/login"} element={
                <Login/>
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
