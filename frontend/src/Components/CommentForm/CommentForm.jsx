import React, {useEffect, useState} from 'react';
import './CommentForm.css'
import axios from "axios";

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const Comment = ({username, comment, onDeleteComment, onUpdateComment, onAddComment}) => {
    const [addCommentModeOn, setAddCommentModeOn] = useState(false);

    const submitDeleteComment = (commentId) => {
        onDeleteComment(comment.id)
    }

    const submitUpdateComment = (commentId, content) => {
        // 답글 수정 모드로 설정
    }

    const handleAddCommentMode = () => {
        addCommentModeOn ? setAddCommentModeOn(false) : setAddCommentModeOn(true);
    }

    const handleReplyComment = (content, parentId) => {
        onAddComment(content, parentId)
        setAddCommentModeOn(false)
    }

    return (
        <div>
            <div key={comment.id} className="comment">
                <div className="comment-left">
                    <h4 className="comment-author">{comment.author}</h4>
                    <p className="comment-content">{comment.content}</p>
                </div>
                <div className="comment-buttons-container">
                    <button onClick={submitDeleteComment}>삭제</button>
                    <button onClick={submitUpdateComment}>수정</button>
                </div>
            </div>
            <div className="comment-bottom">
                <button className="reply-comment-button" onClick={handleAddCommentMode}>답글 달기</button>
            </div>
            {addCommentModeOn && (
                <>
                    <div className="comment-reply-container">
                        <hr/>
                        <CommentForm username={username} parentCommentId={comment.id} onAddComment={handleReplyComment}/>
                    </div>
                </>
            )}
            {comment.children && comment.children.map(child => (
                <>
                    <hr/>
                    <div className="" style={{marginLeft: "50px"}}>
                        <Comment
                            key={child.id}
                            comment={child}
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
                         username, comments, onDeleteComment, onUpdateComment, onAddComment
                     }) => {
    return (
        <div className="comment-list">
            {comments.map((comment, index) => (
                comment.parent_comment_id === null && (
                    <>
                        <hr/>
                        <Comment key={index} username={username} comment={comment}
                                 onDeleteComment={onDeleteComment}
                                 onUpdateComment={onUpdateComment}
                                 onAddComment={onAddComment}/>
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
                        articleId, username
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

    useEffect(() => {
        handleGetComment()
    }, []);

    return (
        <div className="comment-box">
            <CommentList comments={comments}
                         username={username}
                         onDeleteComment={handleDeleteComment}
                         onUpdateComment={handleUpdateComment}
                         onAddComment={handleAddComment}
            />
            <hr/>
            <div style={{marginTop: "5px"}}></div>
            <CommentForm articleId={articleId} username={username} onAddComment={handleAddComment}/>
        </div>
    );
};

export default CommentBox;
