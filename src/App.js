import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Feed from './components/Feed';
import AuthForm from './components/AuthForm';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import Post from './components/Post';

function App() {
  // Component to wrap Post and fetch post data by ID
  function SinglePostPage() {
    const { id } = useParams(); // Extract post ID from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPost = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts/${id}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const postData = await response.json();
          setPost(postData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchPost();
      }
    }, [id]); // Only run when 'id' changes

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!post) {
      return <p>No post found</p>;
    }

    // Render the Post component with the fetched data
    return (
      <div style="margin-top: 100px">
        <Post
          postId={post.id}
          username={post.username}
          songId={post.song_id}
          caption={post.caption}
        />
      </div>
    );
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/register" element={<AuthForm type="register" />} />
        <Route path="/posts/:id" element={<SinglePostPage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
