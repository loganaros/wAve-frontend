import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import './Comment.css';

const Comment = ({ comment, onDelete }) => {
  const token = localStorage.getItem('token'); // Get token from local storage to check if user is signed in
  let currentUserId = null;

  // Decode the token to get the current user ID
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      currentUserId = decodedToken.userId; // Assuming your token has a userId field
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // Handle delete comment
  const handleDeleteComment = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("You must be logged in to delete a comment.");
      return;
    }

    try {
      await axios.delete(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/comments/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Comment deleted successfully.");
      
      // Call the onDelete prop to refresh the comments list after deletion
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment.');
    }
  };

  return (
    <div className="comment-container">
      <p className="comment-username">{comment.username}</p>
      <p className="comment-text">{comment.comment}</p>
      <p className="comment-created-at">{new Date(comment.created_at).toLocaleString()}</p>
      {currentUserId === comment.user_id && (
        <button className="delete-comment-button" onClick={handleDeleteComment}>
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
