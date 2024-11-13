import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comments.css';
import Comment from './Comment';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Get all comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Submit a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('You must be logged in to comment');
      return;
    }
    try {
      const response = await axios.post(
        `https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts/${postId}/comments`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error adding comment');
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <div className="comments-list">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Post Comment</button>
      </form>
      {message && <p className="comment-message">{message}</p>}
    </div>
  );
};

export default Comments;
