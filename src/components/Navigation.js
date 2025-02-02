import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();
  const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
  const learnedWords = JSON.parse(localStorage.getItem('learnedWords') || '[]');
  const totalWords = savedWords.length + learnedWords.length;

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Svenska Learning</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/profile"
              className={location.pathname === '/profile' ? 'active' : ''}
            >
              <FaUser className="me-2" />
              Мій профіль
              {totalWords > 0 && (
                <Badge bg="success" pill className="ms-2">
                  {totalWords}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 