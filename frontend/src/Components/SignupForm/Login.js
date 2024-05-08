import axios from "axios";

export const  asyncLogin = async (username, password) =>{
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            username: username,
            password: password,
        })
        const {access, refresh} = response.data
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        window.location.href = '/' // 혹은 메인 화면으로
    } catch (error) {
        console.error('로그인 오류:', error)
        // 오류 처리 로직을 추가할 수 있습니다.
    }
}

