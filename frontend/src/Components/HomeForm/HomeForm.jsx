import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './HomeForm.css'

const extractDomain = (url) => {
    const domainPattern = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    const matches = url.match(domainPattern)
    if (matches && matches.length > 1) {
        return matches[1]
    }
    return null
}

const HomeForm = () => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/articles/')
                setArticles(response.data.results)
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
        <div className="home-content">
            <div className="home-wrapper">
                <div className="articles">
                    {articles.map((article) => (
                        <div key={article.id} className="article">
                            <h2>
                                {article.article_link ? (
                                    <a href={article.article_link}>{article.title}</a>
                                ) : (
                                    article.title
                                )}
                            </h2>
                            <span className="domain-name">({extractDomain(article.article_link)})</span>
                            <p>{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HomeForm
