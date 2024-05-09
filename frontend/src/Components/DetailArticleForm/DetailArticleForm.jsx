import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DetailArticleForm.css';
import CommentBox from "../CommentForm/CommentForm";

const DetailArticleForm = ({userId, username}) => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/articles/${articleId}/`);
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [articleId]);

    const formatDate = (dateString) => {
        const currentDate = new Date();
        const createdDate = new Date(dateString);
        const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return `${daysDiff}일전`;
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="detail-article-content">
            <div className="topic-table">
                <div className="topic">
                    <div className="vote"></div>
                    <div className="topictitle link">
                        <a href={article.article_link}>{article.title}</a>
                    </div>
                    <div className="topicinfo">
                        <span> by {article.author} | </span>
                        <span>{formatDate(article.created_at)} | </span>
                        <span>Comments: {article.comment_count} | </span>
                        <span>Likes: {article.likey_count}</span>
                    </div>
                    <div className="topic_contents">
                        {article.content}
                    </div>

                </div>
            </div>
            <div className="comment-form">
                <CommentBox articleId={articleId} username={username} userId={userId}/>
            </div>
        </div>
    );
};

export default DetailArticleForm;
