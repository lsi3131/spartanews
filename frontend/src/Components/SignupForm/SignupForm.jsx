import React from 'react'
import axios from 'axios'

import './SignupForm.css'
import {Container, Row, Col, Button} from "react-bootstrap";

const SignupForm = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const [email, setEmail] = React.useState('')

    return (
        <div className="signup-content">
            <Container className="input-box">
                <Row className="signup-row">
                    <Col className="bold-text signup-col">아이디</Col>
                    <input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Row>
                <Row className="signup-row">
                    <Col className="bold-text signup-col-title">비밀번호</Col>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Row>
                <Row className="signup-row">
                    <Col className="bold-text signup-col-title">비밀번호 재확인</Col>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        required
                    />
                </Row>
                <Row className="signup-row">
                    <Col className="bold-text signup-col-title">이메일</Col>
                    <input
                        type="text"
                        placeholder="이메일주소를 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Row>
                <Row className="signup-row">
                    <Col xs={12}>
                        <Button variant="primary">가입하기</Button>{' '}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignupForm
