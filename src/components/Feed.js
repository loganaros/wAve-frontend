import NewPostForm from "./NewPostForm";
import Post from "./Post";
import { useState, useEffect } from "react";
import axios from 'axios';
import './Feed.css';

function Feed() {
    // Get token from local storage
    const token = localStorage.getItem('token');

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get all posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get('https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts');

                setPosts(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="feed-container">
            <div className="posts-container">
                {loading ? (
                    <p className="loading-message">Loading posts...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : posts.length === 0 ? (
                    <p className="loading-message">No posts available</p>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            postId={post.id}
                            username={post.username}
                            songId={post.song_id}
                            caption={post.caption}
                        />
                    ))
                )}
            </div>
            {token && <NewPostForm />}
        </div>
    );
}

export default Feed;
