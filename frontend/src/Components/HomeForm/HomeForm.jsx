import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import './HomeForm.css'
import { Link, Route } from 'react-router-dom'
import Pagination from '../Pagination/Pagination'

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

    const [currentPage, setCurrentPage] = useState(1)
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const [userId, setUserId] = useState(null) // userId 상태 추가

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/articles/?page=${currentPage}`)
                setArticles(response.data)
                setLoading(false)
            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
                setLoading(false)
            }
        }
        fetchData()

        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken)
            setUserId(decodedToken.user_id)
        }
    }, [currentPage])

    const likeButton = async (articleId) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/articles/${articleId}/likey/`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } },
            )
            const Updateresponse = await axios.get(`http://127.0.0.1:8000/api/articles/?page=${currentPage}`)
                setArticles(Updateresponse.data)
        } catch (error) {
            console.error('에러가 발생했습니다:', error)
        }
    }

    const UnlikeButton = async (articleId) => {
        const accessToken = localStorage.getItem('accessToken')
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}/likey/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            const Updateresponse = await axios.get(`http://127.0.0.1:8000/api/articles/?page=${currentPage}`)
                setArticles(Updateresponse.data)
        } catch (error) {
            console.error('에러가 발생했습니다:', error)
        }
    }

    const formatDate = (dateString) => {
        const currentDate = new Date()
        const createdDate = new Date(dateString)
        const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime())
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return `${daysDiff}일전`
    }

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
                    {articles.results && articles.results.map((article, index) => (
                        <div key={article.id} className="article">
                            <div className="article-num">{index + 1 + (currentPage - 1) * articles.per_page}</div>
                            <div className="article-head">
                                <p></p>
                                <h2>
                                    {article.article_link ? (
                                        <a href={article.article_link}>
                                            {article.title.length < 20
                                                ? article.title
                                                : article.title.slice(0, 20) + '...'}
                                        </a>
                                    ) : (
                                        article.title
                                    )}
                                </h2>
                                <span className="domain-name">({extractDomain(article.article_link)})</span>
                            </div>
                            <div className="article-body">
                                <a href="">
                                    {article.content.length < 30
                                        ? article.content
                                        : article.content.slice(0, 30) + '...'}
                                </a>
                            </div>
                            <div className="article-bottom">
                                <span> by {article.author} | </span>
                                <span>{formatDate(article.created_at)} | </span>
                                <span>Comments: {article.comment_count} | </span>
                                <span>Likes: {article.likey_count}</span>
                                {userId !== null &&
                                    (article.likey_user_id.includes(userId) ? (
                                        <button onClick={() => UnlikeButton(article.id)}>Unlike</button>
                                    ) : (
                                        <button onClick={() => likeButton(article.id)}>Like</button>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={articles.total_page} onPageChange={handlePageChange} />
        </div>
    )
}

export default HomeForm
