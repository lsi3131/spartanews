import { useState, useEffect } from 'react'
import axios from 'axios'
import './WriteForm.css'


export default function WriteForm() {
    const accessToken = localStorage.getItem('accessToken')
    const [articleType, setArticleType] = useState('news')
    const [title, setTitle] = useState('')
    const [articleLink, setArticleLink] = useState('')
    const [content, setContent] = useState('')

    function register() {
        const data = {
            title: title,
            article_type: articleType,
            article_link: articleLink,
            content: content,
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        axios
            .post('http://127.0.0.1:8000/api/articles/', data, { headers: headers })
            .then((response) => {
                console.log('register successful:', response.data)
                window.location.href = '/'
            })
            .catch((error) => {
                console.error('Error during register:', error)
            })
    }

    return (
        <div className="write-content">
            <div className="write-wrapper">
                <div className="inputName">
                    타입
                    <select
                        name="category"
                        value={articleType}
                        onChange={(e) => {
                            setArticleType(e.target.value)
                            if (e.target.value === 'ask') {
                                document.querySelector('.linkInput').style.display = 'none'
                            } else {
                                document.querySelector('.linkInput').style.display = 'block'
                            }
                        }}
                    >
                        <option value="news" selected={true}>
                            News
                        </option>
                        <option value="ask">Ask</option>
                        <option value="show">Show</option>
                    </select>
                </div>

                <div className="inputName">
                    제목
                    <input
                        type="text"
                        name="userid"
                        placeholder="제목을 적어주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="inputName linkInput">
                    링크
                    <input
                        type="url"
                        name="userid"
                        placeholder="URL 주소를 적어주세요"
                        value={articleLink}
                        onChange={(e) => setArticleLink(e.target.value)}
                    />
                </div>

                <div className="inputName">
                    내용
                    <textarea
                        name="userid"
                        placeholder="간단하게 내용을 적어주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <button onClick={register}>등록</button>
            </div>
        </div>
    )
}
