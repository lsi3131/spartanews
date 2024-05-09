import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
    }, [currentPage]) // 빈 배열을 전달하여 초기 렌더링 시에만 실행되도록 함

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
                    {articles.results.map((article) => (
                        <div key={article.id} className="article">
                            <h2>
                                <Link to={`/detail/${article.id}`}>
                                    <p>{article.title}</p>
                                </Link>
                            </h2>
                            <span className="domain-name">({extractDomain(article.article_link)})</span>
                            <p>{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={articles.total_page} onPageChange={handlePageChange} />
        </div>
    )
}

export default HomeForm
