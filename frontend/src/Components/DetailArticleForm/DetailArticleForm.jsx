import {useParams} from 'react-router-dom';

import './DetailArticleForm.css'

const DetailArticleForm = () => {
    const {articleId} = useParams();

    return (
        <div className="detail-article-content">
            <div>
                <h1>뉴스 아이디-{articleId}</h1>
                <h1>여기서 작업하시면 됩니다</h1>
            </div>
        </div>
    )
};

export default DetailArticleForm;