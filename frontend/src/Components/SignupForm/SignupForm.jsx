import React from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

import './SignupForm.css'
import {Container, Row, Col, Button, Alert} from "react-bootstrap";

const SignupForm = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [introduce, setIntroduce] = React.useState('')
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const navigate = useNavigate();


    function signup() {
        const text = `id=${username}, password=${password}, password-check=${passwordCheck}, email=${email}, introduce=${introduce}`
        console.log(text)
        /*
            다음 정보를 체크한다.
            1. password, passwordCheck가 동일한지 여부
            2. id, password 작성 여부
         */
        setErrorMessage('')
        setShowError(false)
        // 필수 입력요소가 없을 경우 메시지 전달
        if (!username || !password || !passwordCheck) {
            let message = '';
            if (!username) {
                message = '사용자 이름을 입력해주세요'
            } else if (!password) {
                message = '비밀번호를 입력해주세요'
            } else if (!passwordCheck) {
                message = '비밀번호 재확인을 입력해주세요'
            }
            setShowError(true);
            setErrorMessage(message)
            return;
        }

        if (password !== passwordCheck) {
            let message = '비밀번호가 일치하지 않습니다'
            setShowError(true);
            setErrorMessage(message)
            return;
        }

        const data = {
            username: username,
            password: password,
            email: email,
            introduce: introduce
        };

        const urlRoot = 'http://127.0.0.1:8000'
        const url = `${urlRoot}/api/accounts/`

        axios.post(url, data)
            .then(response => {
                console.log('Signup successful:', response.data);
                navigate('/login');
            })
            .catch(error => {
                console.error('Error during signup:', error.response.data.error);

                setErrorMessage(error.response.data.error)
                setShowError(true)
            });
    }

    return (
        <div className="signup-content p-4">
            <Container className="input-box signup-wrapper">
                <Row className="">
                    <Col className="bold-text signup-col">아이디</Col>
                    <input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Row>
                <Row className="mt-2">
                    <Col className="bold-text signup-col-title">비밀번호</Col>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Row>
                <Row className="mt-2">
                    <Col className="bold-text signup-col-title">비밀번호 재확인</Col>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        required
                    />
                </Row>
                {/* ======================
                    이메일 추가 시 인터페이스 적용
                ==========================*/}

                {/*<Row className="mt-2">*/}
                {/*    <Col className="bold-text signup-col-title">이메일</Col>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        placeholder="이메일주소를 입력해주세요"*/}
                {/*        value={email}*/}
                {/*        onChange={(e) => setEmail(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*</Row>*/}

                {/* ======================
                    자기소개 추가 시 인터페이스 적용
                ==========================*/}
                {/*<Row className="mt-2">*/}
                {/*    <Col className="bold-text signup-col-title">자기소개</Col>*/}
                {/*    <textarea*/}
                {/*        className="signup-textarea"*/}
                {/*        placeholder="소개글을 입력해주세요"*/}
                {/*        rows={5}*/}
                {/*        value={introduce}*/}
                {/*        onChange={(e) => setIntroduce(e.target.value)}*/}
                {/*    />*/}
                {/*</Row>*/}

                <Row className="mt-3">
                    <Button variant="primary" size="lg" onClick={signup}>가입하기</Button>{' '}
                </Row>

                {showError && (
                    <Row className="mt-2">
                        <Col>
                            <Alert variant="danger">{errorMessage}</Alert>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    )
}

export default SignupForm
