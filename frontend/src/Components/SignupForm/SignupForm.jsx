import React from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

import './SignupForm.css'

const SignupForm = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [introduce, setIntroduce] = React.useState('')
    const [usernameMessage, setUsernameMessage] = React.useState('');
    const [passwordMessage, setPasswordMessage] = React.useState('');
    const [passwordCheckMessage, setPasswordCheckMessage] = React.useState('');
    const [emailCheckMessage, setEmailCheckMessage] = React.useState('');

    // 제출용 데이터 정보. username, email, password가 입력이 되어 있어야 제출 가능
    const [formValidateChecker, setFormValidateChecker] = React.useState({
        username: false,
        email: false,
        password: false,
        passwordCheck: false
    })

    const navigate = useNavigate();

    function getUrl(subUrl) {
        const urlRoot = 'http://127.0.0.1:8000'
        return `${urlRoot}${subUrl}`
    }

    async function signup() {
        try {
            await checkUserName();
            await checkPassword();
            await checkPasswordCheck();
            await checkEmail();
        } catch (error) {
            console.log(error)
        }

        if (formValidateChecker.username === false) {
            console.log('invalid username');
            return
        } else if (formValidateChecker.email === false) {
            console.log('invalid email');
            return
        } else if (formValidateChecker.password === false) {
            console.log('invalid password');
            return
        } else if (formValidateChecker.passwordCheck === false) {
            console.log('invalid password check');
            return
        }

        const data = {
            username: username,
            password: password,
            email: email,
            introduce: introduce
        };

        const url =  getUrl('/api/accounts/')
        try {
            const response = await axios.post(url, data)
            console.log('Signup successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Error during signup:', error.response.data.error);
        }
    }

    async function checkUserName() {
        if (username === '') {
            setUsernameMessage('')
            return
        }

        const data = {
            'data': username
        }

        const url =  getUrl('/api/accounts/validate/username/')
        try {
            const response = await axios.post(url, data)
            setUsernameMessage('')
            setFormValidateChecker({
                ...formValidateChecker,
                'username': true
            })
        } catch (error) {
            setUsernameMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                'username': false
            })
        }
    }

    async function checkPassword() {
        if (password === '') {
            setPasswordMessage('')
            return
        }

        const data = {
            'data': password
        }

        const url =  getUrl('/api/accounts/validate/password/')
        try {
            const response = await axios.post(url, data)
            setPasswordMessage('')
            setFormValidateChecker({
                ...formValidateChecker,
                'password': true
            })

        } catch (error) {
            setPasswordMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                'password': false
            })

        }

        checkPasswordCheck()
    }

    function checkPasswordCheck() {
        if (passwordCheck === '') {
            setPasswordCheckMessage('')
            return
        }

        if (passwordCheck === password) {
            setPasswordCheckMessage('')
            setFormValidateChecker({
                ...formValidateChecker,
                'passwordCheck': true
            })

        } else {
            setPasswordCheckMessage('비밀번호가 일치하지 않습니다.')
            setFormValidateChecker({
                ...formValidateChecker,
                'passwordCheck': false
            })
        }
    }

    async function checkEmail() {
        if (email === '') {
            setEmailCheckMessage('')
            return
        }

        const data = {
            'data': email
        }

        const url =  getUrl('/api/accounts/validate/email/')
        try {
            const response = await axios.post(url, data)
            setEmailCheckMessage('')
            setFormValidateChecker({
                ...formValidateChecker,
                'email': true
            })

        } catch (error) {
            console.error('error in check email:', error.response.data.error);
            setEmailCheckMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                'email': false
            })
        }
    }

    return (
        <div className="signup-content">
            <div className="signup-wrapper">
                <h4 className="inputName">아이디</h4>
                <input
                    type="text"
                    placeholder="아이디를 입력해주세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={checkUserName}
                    required
                />
                <p className="error-message">{usernameMessage}</p>

                <h4 className="inputName">비밀번호</h4>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={checkPassword}
                    required
                />
                <p className="error-message">{passwordMessage}</p>

                <h4 className="inputName">비밀번호 재확인</h4>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    onBlur={checkPasswordCheck}
                    required
                />
                <p className="error-message">{passwordCheckMessage}</p>

                {/* ======================
                    이메일 추가 시 인터페이스 적용
                ==========================*/}
                <h4 className="inputName">이메일</h4>
                <input
                    type="text"
                    placeholder="이메일주소를 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={checkEmail}
                    required
                />
                <p className="error-message">{emailCheckMessage}</p>

                <h4 className="inputName">자기소개</h4>
                <textarea
                    className="signup-textarea"
                    placeholder="소개글을 입력해주세요"
                    rows={5}
                    value={introduce}
                    onChange={(e) => setIntroduce(e.target.value)}
                />

                <button onClick={signup}>회원가입</button>
            </div>
        </div>
    )
}

export default SignupForm
