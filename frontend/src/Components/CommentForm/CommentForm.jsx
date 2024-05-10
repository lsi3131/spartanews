import React, {useEffect, useState} from 'react';
import './CommentForm.css'
import axios from "axios";
import likeImage from '../../Assets/images/00_like.png'
import unlikeImage from '../../Assets/images/01_unlike.png';

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const Comment = ({
                     username,
                     userId,
                     accessToken,
                     articleId,
                     comment,
                     onDeleteComment,
                     onUpdateComment,
                     onAddComment,
                 }) => {
    const [addCommentModeOn, setAddCommentModeOn] = useState(false);
    const [updateCommentModeOn, setUpdateCommentModeOn] = useState(false);
    const [content, setContent] = useState('');
    const [recommendList, setRecommendList] = useState(comment.recommend)

    const submitDeleteComment = () => {
        const result = window.confirm("댓글을 삭제하시겠습니까?");
        if (result) {
            onDeleteComment(comment.id)
        }
    }

    const submitUpdateComment = () => {
        onUpdateComment(comment.id, content)
        setUpdateCommentModeOn(false)
    }

    const handleUpdateCommentMode = () => {
        setContent(comment.content)
        setUpdateCommentModeOn(true)
    }

    const handleCancelUpdate = () => {
        setUpdateCommentModeOn(false)
    }

    const handleAddCommentMode = () => {
        addCommentModeOn ? setAddCommentModeOn(false) : setAddCommentModeOn(true);
    }


    const handleReplyComment = (content, parentId) => {
        onAddComment(content, parentId)
        setAddCommentModeOn(false)
    }

    const handleRecommendComment = () => {
        if(!username) {
            return
        }
        if (recommendList.includes(userId)) {
            handleDeleteRecommendComment(comment.id)
        } else {
            handleAddRecommendComment(comment.id)
        }
    }

    const handleAddRecommendComment = (commentId) => {
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/recommand/`)
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        axios.post(url, {}, {headers: headers})
            .then(response => {
                console.log('add recommend successful:', response.data);
                setRecommendList(prevRecommendList => [...prevRecommendList, userId]);
            })
            .catch(error => {
                console.error('Error during add recommend comments:', error.response.data.error);
            })
    }

    const handleDeleteRecommendComment = (commentId) => {
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/recommand/`)
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        axios.delete(url, {headers: headers})
            .then(response => {
                console.log('delete recommend successful:', response.data);
                const deletedList = recommendList.filter(item => item !== userId);
                setRecommendList(deletedList);
            })
            .catch(error => {
                console.error('Error during delete recommend comments:', error.response.data.error);
            })
    }


    const getUpdateTime = (timestamp) => {
        const currentDate = new Date();
        const previousDate = new Date(timestamp);

        const difference = currentDate - previousDate;
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours >= 24) {
            const year = previousDate.getFullYear();
            const month = String(previousDate.getMonth() + 1).padStart(2, '0');
            const day = String(previousDate.getDate()).padStart(2, '0');
            const hour = String(previousDate.getHours()).padStart(2, '0');
            const minute = String(previousDate.getMinutes()).padStart(2, '0');
            return `${year}.${month}.${day} ${hour}:${minute}`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else {
            return `${seconds}초 전`;
        }
    }


    return (
        <div>
            <div key={comment.id}>
                {updateCommentModeOn ? (
                        <div className="comment-vertical">
                            <div className="comment-wrapper">
                                <h4 className="comment-author">{comment.author}</h4>
                                <textarea
                                    placeholder="댓글을 입력하세요"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={4}
                                ></textarea>
                            </div>
                            <div className="comment-justify-end">
                                <div className="comment-update-buttons-container">
                                    <button onClick={handleCancelUpdate}>취소</button>
                                    <button onClick={submitUpdateComment}>수정</button>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <div>
                            <div className="comment">
                                <div className="comment-left">
                                    <h4 className="comment-author">{comment.author}</h4>
                                    <pre className="comment-content">{comment.content}</pre>
                                </div>
                                {(comment.author === username) && (
                                    <div className="comment-buttons-container">
                                        <button onClick={submitDeleteComment}>삭제</button>
                                        <button onClick={handleUpdateCommentMode}>수정</button>
                                    </div>
                                )}
                            </div>
                            <div className="comment-bottom">
                                <>
                                    <button onClick={handleRecommendComment}>
                                        <img src={recommendList.includes(userId) ? likeImage : unlikeImage} alt="Like"
                                             style={{width: "20px"}}/>
                                    </button>
                                    <span>좋아요 {recommendList.length}</span>
                                </>
                                <span>•</span>

                                <span>{getUpdateTime(comment.created_at)}</span>
                                {username && (
                                    <>
                                        <span>•</span>
                                        <button className="reply-comment-button" onClick={handleAddCommentMode}>답글 달기
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                    )}
            </div>
            {addCommentModeOn && (
                <>
                    <div className="comment-reply-container">
                        <hr/>
                        <CommentForm username={username} parentCommentId={comment.id}
                                     onAddComment={handleReplyComment}/>
                    </div>
                </>
            )}
            {comment.children && comment.children.map(child => (
                <>
                    <hr/>
                    <div className="" style={{marginLeft: "50px"}}>
                        <Comment
                            key={child.id}
                            accessToken={accessToken}
                            username={username}
                            userId={userId}
                            comment={child}
                            articleId={articleId}
                            onDeleteComment={onDeleteComment}
                            onUpdateComment={onUpdateComment}
                            onAddComment={onAddComment}
                        />
                    </div>
                </>
            ))}
        </div>
    );
};

const CommentList = ({
                         username,
                         userId,
                         accessToken,
                         articleId,
                         comments,
                         onDeleteComment,
                         onUpdateComment,
                         onAddComment,
                         onAddRecommendComment,
                         onDeleteRecommendComment
                     }) => {
    return (
        <div className="comment-list">
            {comments.map((comment, index) => (
                comment.parent_comment_id === null && (
                    <>
                        <hr/>
                        <Comment key={index} username={username} userId={userId} accessToken={accessToken}
                                 articleId={articleId} comment={comment}
                                 onDeleteComment={onDeleteComment}
                                 onUpdateComment={onUpdateComment}
                                 onAddComment={onAddComment}
                                 onAddRecommendComment={onAddRecommendComment}
                                 onDeleteRecommendComment={onDeleteRecommendComment}
                        />
                    </>
                )
            ))}
        </div>
    );
};

const CommentForm = ({username, onAddComment, parentCommentId}) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        onAddComment(content, parentCommentId)
        setContent('');
    };

    return (
        <div>
            <div className="comment-wrapper">
                <div className="" style={{marginRight: '10px'}}>
                    <h4>{username}</h4>
                </div>
                <textarea
                    placeholder="댓글을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                ></textarea>
            </div>
            <div className="comment-buttons-container">
                <p></p>
                <button onClick={handleSubmit} style={{width: '100px'}}>댓글 등록</button>
            </div>
        </div>
    );
};

const CommentBox = ({
                        articleId, userId, username
                    }) => {
    const accessToken = localStorage.getItem('accessToken')
    const [comments, setComments] = useState([]);

    const handleGetComment = () => {
        const url = getUrl(`/api/articles/${articleId}/comments/`)
        axios.get(url)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    };

    const handleAddComment = (content, parentId = null) => {
        console.log(`text=${content}`)

        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        let data = null
        if (parentId !== null) {
            data = {
                content: content,
                parent_comment_id: parentId
            };
            console.log('add parent comment id', parentId)
        } else {
            data = {
                content: content,
            };
        }

        const url = getUrl(`/api/articles/${articleId}/comments/`)
        axios.post(url, data, {headers: headers})
            .then(response => {
                console.log('add comments successful:', response.data);
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    };

    const handleDeleteComment = (commentId) => {
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }
        console.log('try delete', headers)
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/`)
        axios.delete(url, {headers: headers})
            .then(response => {
                console.log('delete comments successful:', response.data);
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during delete comments:', error.response.data.error);
            })
    }

    const handleUpdateComment = (commentId, content) => {
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/`)
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }
        const data = {
            content: content,
        };

        axios.put(url, data, {headers: headers})
            .then(response => {
                console.log('update comments successful:', response.data);
                handleGetComment()
            })
            .catch(error => {
                console.error('Error during delete comments:', error.response.data.error);
            })
    }

    const handleAddRecommendComment = (commentId) => {
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/recommand/`)
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        axios.post(url, {}, {headers: headers})
            .then(response => {
                console.log('add recommend successful:', response.data);
            })
            .catch(error => {
                console.error('Error during add recommend comments:', error.response.data.error);
            })
    }

    const handleDeleteRecommendComment = (commentId) => {
        const url = getUrl(`/api/articles/${articleId}/comments/${commentId}/recommand/`)
        const headers = {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        }

        axios.delete(url, {headers: headers})
            .then(response => {
                console.log('delete recommend successful:', response.data);
            })
            .catch(error => {
                console.error('Error during delete recommend comments:', error.response.data.error);
            })
    }


    useEffect(() => {
        handleGetComment()
    }, []);

    return (
        <div className="comment-box">
            <CommentList comments={comments}
                         username={username}
                         userId={userId}
                         accessToken={accessToken}
                         articleId={articleId}
                         onDeleteComment={handleDeleteComment}
                         onUpdateComment={handleUpdateComment}
                         onAddComment={handleAddComment}
                         onAddRecommendComment={handleAddRecommendComment}
                         onDeleteRecommendComment={handleDeleteRecommendComment}
            />
            <hr/>
            <div style={{marginTop: "5px"}}></div>
            {username && (
                <CommentForm articleId={articleId} username={username} onAddComment={handleAddComment}/>
            )}
        </div>
    );
};

export default CommentBox;
