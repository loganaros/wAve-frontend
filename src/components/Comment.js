import React from 'react';
import './Comment.css';

const Comment = ({ comment }) => {
  return (
    <div className="comment-container">
      <p className="comment-username">{comment.username}</p>
      <p className="comment-text">{comment.comment}</p>
      <p className="comment-created-at">{new Date(comment.created_at).toLocaleString()}</p>
    </div>
  );
};

export default Comment;
