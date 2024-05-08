import React, {useEffect, useState} from 'react';
import './CommentForm.css'
import axios from "axios";

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const AddComment = ({parentComment, onAddComment}) => {
    const [content, setContent] = useState('');

    const submitAddComment = () => {
        console.log(`content=${content}, id=${parentComment.id}`)
        onAddComment(content, parentComment.id)
    }

    return (
        <div>
            <div className="comments-input">
                <div className="">
                    {/*<p>[이미지넣을까]</p>*/}
                    <p>{'[유저이름]'}</p>
                </div>
                <textarea
                    placeholder="댓글을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
            </div>
            <div>
                <button onClick={submitAddComment}>댓글 등록</button>
            </div>
        </div>
    )
}

const Comment = ({comment, onDeleteComment, onUpdateComment, onAddComment}) => {
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

    return (
        <div>
            <div key={comment.id} className="comment">
                <h4 className="comment-author">{comment.author}</h4>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-buttons-container">
                    <button onClick={submitDeleteComment}>삭제</button>
                    <button onClick={submitUpdateComment}>수정</button>
                </div>
            </div>
            <div className="comment-bottom">
                <button onClick={handleAddCommentMode}>답글</button>
            </div>
            {addCommentModeOn && (
                <>
                    <div className="comment-add">
                        <AddComment parentComment={comment} onAddComment={onAddComment}/>
                    </div>
                </>
            )
            }
        </div>
    );
};

const CommentList = ({
                         comments, onDeleteComment, onUpdateComment, onAddComment
                     }) => {
    return (
        <div className="comment-list">
            {comments.map((comment, index) => (
                comment.parent_comment_id === null && (
                    <Comment key={index} comment={comment}
                             onDeleteComment={onDeleteComment}
                             onUpdateComment={onUpdateComment}
                             onAddComment={onAddComment}/>
                )
            ))}
        </div>
    );
};

const CommentForm = ({
                         articleId, username, onAddComment
                     }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        onAddComment(content)

        setContent('');
    };

    return (
        <div>
            <div className="comments-input">
                <div className="">
                    <p>{username}</p>
                </div>
                <textarea
                    placeholder="댓글을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
            </div>
            <button onClick={handleSubmit}>댓글 등록</button>
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
                         onDeleteComment={handleDeleteComment}
                         onUpdateComment={handleUpdateComment}
                         onAddComment={handleAddComment}
            />
            <hr style={{marginTop: '20px', marginBottom: '20px'}}/>
            <CommentForm articleId={articleId} username={username} onAddComment={handleAddComment}/>
        </div>
    );
};

export default CommentBox;
