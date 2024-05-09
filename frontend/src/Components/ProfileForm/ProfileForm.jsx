import './ProfileForm.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ProfileForm = (props) => {
    const { username } = props
    const { name } = useParams()
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const dateChange = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        return formattedDate
    }

    const logoutProcess = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/accounts/${name}/`)
                setUserInfo(response.data)
                setLoading(false)
            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
                setLoading(false)
            }
        }
        fetchData()
    }, []) // 빈 배열을 전달하여 초기 렌더링 시에만 실행되도록 함

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="profile-content">
            <div className="profile-wrapper">
                <div className="profile-title">프로필</div>
                <div className="profile-info">
                    <div className="profile-info-item">
                        <span className="subject">이름</span>
                        <span className="text">{userInfo.username}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="subject">이메일</span>
                        <span className="text">{userInfo.email}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="subject">가입일</span>
                        <span className="text">{dateChange(userInfo.date_joined)}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="subject">포인트</span>
                        <span className="text">{userInfo.point} P</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="subject">소개</span>
                        <span className="text introtext">{userInfo.introduce}</span>
                    </div>
                </div>
                {username === userInfo.username && <button className="profile-button" onClick={logoutProcess}>Logout</button>}
            </div>
        </div>
    )
}

export default ProfileForm
