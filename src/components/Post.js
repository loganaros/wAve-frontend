import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post.css';
import Comments from './Comments';

const Post = () => {
    const { id: postId } = useParams(); // Get the post ID from the URL
    const [post, setPost] = useState(null);
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);

    // Fetch post data from API
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setError(null);
                setLoading(true);
                // Fetch the post data from the backend using postId
                const postResponse = await fetch(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts/${postId}`);
                if (!postResponse.ok) {
                    throw new Error(`Error: ${postResponse.status} ${postResponse.statusText}`);
                }
                const postData = await postResponse.json();
                setPost(postData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [postId]);

    // Fetch song data from API
    useEffect(() => {
        if (post && post.song_id) {
            const fetchSongData = async () => {
                try {
                    setError(null);
                    setLoading(true);

                    const response = await fetch(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/song/${post.song_id}`);

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    setSong(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchSongData();
        }
    }, [post]);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="post-container">
            {song && (
                <div className="spotify-embed-container">
                    <iframe
                        src={`https://open.spotify.com/embed/track/${song.id}`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                    ></iframe>
                </div>
            )}

            {post && (
                <div className="post-content">
                    <h4>@{post.username}</h4>
                    <p>{post.caption}</p>
                </div>
            )}

            <div className="post-footer">
                <button className="comment-button" onClick={toggleComments}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M20 17.17V4H4v10h4v4.17L12.17 14H20zm2-14H2v16l4-4h14V3z" />
                    </svg>
                    {showComments ? 'Hide Comments' : 'Comment' }
                </button>
            </div>

            {showComments && <Comments postId={postId} />}
        </div>
    );
};

export default Post;
