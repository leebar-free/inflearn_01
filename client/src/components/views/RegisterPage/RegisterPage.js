import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
// import { loginUser } from '../../../_actions/user_action.js';
import { registerUser } from '../../../_actions/user_action.js';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    };

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밓번호화 비밀번호 확인은 같아야 합니다.')
        }

        console.log('Email', Email)
        console.log('Name', Name)
        console.log('Password', Password)

        let body = {
            email: Email,
            name: Name,
            password: Password
        }

        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login');
                } else {
                    alert('failed to sign up!');
                }
            })

    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler} >
                <label>E-Mail</label>
                <input type="email" value={Email} onChange={onEmailHandler}></input>

                <label>Name</label>
                <input type="name" value={Name} onChange={onNameHandler}></input>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}></input>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}></input>

                <br/>
                <button type="submit">
                    회원가입
                </button>

            </form>

        </div>
    )
}

export default withRouter(RegisterPage)
