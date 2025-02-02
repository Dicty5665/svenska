import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LessonList from './components/LessonList';
import LessonView from './components/LessonView';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<LessonList />} />
        <Route path="/lesson/:id" element={<LessonView />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App; 