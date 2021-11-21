import './public/App.css';
import {useEffect, useState} from "react";
import { Quiz } from "./components/routes/quiz/Quiz";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation, Redirect} from "react-router-dom";
import { LinkToQuiz, RouteLink } from "./components/buttons/RouteLink";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut,setPersistence, browserSessionPersistence } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {Login} from "./components/routes/login/Login";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import {GenerateQuiz} from "./components/routes/generate-quiz/GenerateQuiz";
import {Home} from "./components/routes/home/Home";

const firebaseConfig = {
    apiKey: "AIzaSyA_7gdRXW4HhssdlhDsjEkt3XoT5olXPww",
    authDomain: "quizzer-e33d6.firebaseapp.com",
    projectId: "quizzer-e33d6",
    storageBucket: "quizzer-e33d6.appspot.com",
    messagingSenderId: "685329935050",
    appId: "1:685329935050:web:8c167aa64131046ac5e233"
}
const app = initializeApp(firebaseConfig)

const AppContent = () => {
    return (
        <Routes>
            <Route path="/quiz/:id/:amount/:category/:difficulty/:type" element={
                <PrivateRoute>
                    <Quiz/>
                </PrivateRoute>
            }>
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
    const auth = getAuth()
    // setPersistence(auth, browserSessionPersistence).then(() => {return loginHandler()}).catch(error => {console.log(error.message)})
    const [user] = useAuthState(auth)

    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

export default App;
