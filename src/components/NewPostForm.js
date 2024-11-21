import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewPostForm.css';
import { useNavigate } from 'react-router-dom';

const NewPostForm = () => {
  const [formData, setFormData] = useState({
    songId: '',
    caption: '',
  });
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState(''); // State for song search query
  const [searchResults, setSearchResults] = useState([]); // State for Spotify search results
  const [accessToken, setAccessToken] = useState(''); // Store Spotify access token
  const [isFocused, setIsFocused] = useState(false); // State to track input focus
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Fetch Spotify access token from backend
    const getToken = async () => {
      try {
        const response = await axios.get('https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/spotify-token');
        setAccessToken(response.data.accessToken);
      } catch (error) {
        console.error('Error fetching Spotify access token:', error);
      }
    };
    getToken();
  }, []);

  // Handle input changes for caption and search query
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle input focus and blur to manage state
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Search for songs as the user types in the search field
  useEffect(() => {
    if (query.length > 2 && accessToken) {
      const searchSongs = async () => {
        try {
          const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              q: query,
              type: 'track',
              limit: 5,
            },
          });
          setSearchResults(response.data.tracks.items);
        } catch (error) {
          console.error('Error searching for songs:', error);
        }
      };
      searchSongs();
    } else {
      setSearchResults([]); // Clear results if query is too short
    }
  }, [query, accessToken]);

  // Handle selecting a song from the autocomplete dropdown
  const handleSongSelect = (song) => {
    setFormData({ ...formData, songId: song.id });
    setQuery(`${song.name} - ${song.artists[0].name}`); // Update input with the song name and artist
    setSearchResults([]); // Clear search results after selection
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (!token) {
      setMessage('You must be logged in to create a post');
      return;
    }

    // Post new post to API
    try {
      const response = await axios.post(
        'https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Post created successfully!');
      setFormData({
        songId: '',
        caption: '',
      });
      setQuery(''); // Clear the query after posting

      // Redirect to the newly created post using navigate
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating post');
    }
  };

  return (
    <div className="new-post-form">
      <h3>Create a New Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="autocomplete-container">
          <input
            type="text"
            name="query"
            placeholder="Search for a song..."
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          {isFocused && searchResults.length > 0 && (
            <ul className="autocomplete-results">
              {/* Autocomplete search */}
              {searchResults.map((song) => (
                <li key={song.id} className="autocomplete-item" onMouseDown={() => handleSongSelect(song)}>
                  <div className="autocomplete-item-content">
                    <img src={song.album.images[2].url} alt={song.name} width="40" height="40" />
                    <span>{song.name} - {song.artists[0].name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea
          name="caption"
          placeholder="Write a caption..."
          value={formData.caption}
          onChange={handleChange}
          required
        />
        <button type="submit">Post</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default NewPostForm;
