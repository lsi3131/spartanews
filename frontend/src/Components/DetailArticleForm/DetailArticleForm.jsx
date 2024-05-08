import {useParams} from 'react-router-dom';

import './DetailArticleForm.css'
import CommentBox from "../CommentForm/CommentForm";
import {useState} from "react";

const DetailArticleForm = () => {
    const {articleId} = useParams();
    const [username, setUsername] = useState('testuser')


    return (
        <div className="detail-article-content">
            <div>
                <h1>뉴스 아이디-{articleId}</h1>
                <h1>여기서 작업하시면 됩니다</h1>
                <CommentBox articleId={articleId} username={username}/>
            </div>
        </div>
    )
};

export default DetailArticleForm;