import axios from 'axios'

const fetchUser = async () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (accessToken) {
        try {
            const verifyResponse = await axios.post('http://127.0.0.1:8000/api/token/verify/', {
                token: accessToken,
            })
            if (verifyResponse.status === 200) {
                return true
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken')
                if (refreshToken) {
                    try {
                        const refreshResponse = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                            refresh: refreshToken,
                        })
                        if (refreshResponse.status === 200) {
                            const newAccessToken = refreshResponse.data.access
                            const newRefreshToken = refreshResponse.data.refresh
                            localStorage.setItem('accessToken', newAccessToken)
                            localStorage.setItem('refreshToken', newRefreshToken)
                            return true
                        }
                    } catch (error) {
                        localStorage.removeItem('refreshToken')
                        return false
                    }
                }
                return false
            }
        }
    } else if (refreshToken) {
        try {
            const refreshResponse = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                refresh: refreshToken,
            })
            if (refreshResponse.status === 200) {
                const newAccessToken = refreshResponse.data.access
                const newRefreshToken = refreshResponse.data.refresh
                localStorage.setItem('accessToken', newAccessToken)
                localStorage.setItem('refreshToken', newRefreshToken)
                return true
            }
        } catch (error) {
            localStorage.removeItem('refreshToken')
            return false
        }
    }
    return false
}

export default fetchUser
