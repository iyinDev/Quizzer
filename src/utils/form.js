import React, {useEffect, useState} from 'react'
import {getAuth, updateProfile} from "firebase/auth";
import {useAuthState, useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";

export function RegistrationForm({ initial }) {
    const auth = getAuth()
    const [createUserWithEmailAndPassword, user, loading, err] = useCreateUserWithEmailAndPassword(auth)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Showing success message
    const successMessage = () => {
        return (
            <div
                className="auth-success" style={{display: submitted ? '' : 'none'}}>
                <div className={"message center"}>
                    {name} SUCCESSFULLY REGISTERED!
                </div>
            </div>
        );
    };

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div className={"auth-error"} style={{display: error ? '' : 'none'}}>
                <div className={"message center"}>ENTER ALL FIELDS</div>
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            setError(true);
        } else {
            setSubmitted(true);
            setError(false);
            createUserWithEmailAndPassword(email, password).then(() => {
                console.log(auth.currentUser)
                updateProfile(auth.currentUser, {displayName: name}).then(() => {
                    window.location.reload()
                })
            })

        }
    };

    useAuthState(auth, () => {

    })

    return (
        <div>
            <div className="messages">
                {successMessage()}
            </div>
            <form>
                <div className={"inputs"}>
                    <div>
                        <label className={"config-labels"}>Email</label>
                        <input className={"input"} value={email} onChange={handleEmail} type={"text"} />
                    </div>

                    <div>
                        <label className={"config-labels"}>Name</label>
                        <input className={"input"} value={name} onChange={handleName} type={"text"} />
                    </div>

                    <div>
                        <label className={"config-labels"}>Password</label>
                        <input className={"input"} value={password} onChange={handlePassword} type={"password"} />
                    </div>
                    <button className={"register-bt"} onClick={handleSubmit} type={"submit"}>REGISTER</button>
                </div>
            </form>

        </div>
    )
}

export function LoginForm({ initial }) {
    const auth = getAuth()
    const [signInWithEmailAndPassword, user, loading, err] = useSignInWithEmailAndPassword(auth)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null)

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Showing error message if error is true
    function AuthMessage() {
        return (
            <div id={"auth-message"} className={"auth-message"} style={{display: error ? '' : 'none'}}>
                <div className={"message center"}>{message}</div>
            </div>
        );
    };

    useEffect(() => {
        const msgBackground = document.getElementById("auth-message")
        if (error === true) {
            msgBackground.style.background = "indianred"
        } else if (error === false) {
            msgBackground.style.background = "#48cb4e"
        } else {
            msgBackground.style.background = "#0067B3"
        }
    }, [error])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === '' || password === '') {
            setError(true);
            if (email === '') {
                setMessage("Enter your email")
            } else {
                setMessage("Enter your password")
            }
        } else {
            signInWithEmailAndPassword(email, password).then(() => {
                if (auth.currentUser) {
                    setSubmitted(true);
                    setError(false);
                    console.log(auth.currentUser)
                    setMessage("LOGGING IN...")
                } else {
                    setError(true)
                    setMessage("Invalid Email/Password")
                }
            }).catch(error => {
                setError(true)
                setMessage("Invalid email/password")
            })
        }
    };

    return (
        <div>
            <div className="messages">
                <AuthMessage/>
            </div>
            <form>
                <div className={"login-inputs"}>
                    <div>
                        <label className={"config-labels"}>Email</label>
                        <input className={"input"} value={email} onChange={handleEmail} type={"text"} />
                    </div>

                    <div>
                        <label className={"config-labels"}>Password</label>
                        <input className={"input"} value={password} onChange={handlePassword} type={"password"} />
                    </div>

                    <button className={"register-bt"} onClick={handleSubmit} type={"submit"}>LOGIN</button>
                </div>
            </form>

        </div>
    )
}
