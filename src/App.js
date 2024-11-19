import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/Feed';
import AuthForm from './components/AuthForm';
import NavBar from './components/NavBar';

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/register" element={<AuthForm type="register" />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
