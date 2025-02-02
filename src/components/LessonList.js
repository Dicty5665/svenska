import React from 'react';
import { Container, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { lessonsData } from '../data/lessons';

const LessonList = () => {
  return (
    <>
      <style>
        {`
          .hover-shadow:hover {
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
            transform: translateY(-2px);
          }
          .card {
            transition: all 0.3s ease;
          }
          .card:hover {
            text-decoration: none;
          }
          .lesson-preview {
            color: #6c757d;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 4.5em;
          }
        `}
      </style>
      <Container className="mt-5">
        <h2 className="mb-4">Уроки шведської мови</h2>
        <div className="row g-4">
          {lessonsData.map((lesson) => (
            <div key={lesson.id} className="col-md-6 col-lg-4">
              <Card 
                as={Link} 
                to={`/lesson/${lesson.id}`}
                className="h-100 text-decoration-none text-dark shadow-sm hover-shadow"
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="primary" className="mb-2">
                      Урок {lesson.order}
                    </Badge>
                  </div>
                  <Card.Title>{lesson.title}</Card.Title>
                  <Card.Text className="lesson-preview">
                    {lesson.content.text}
                  </Card.Text>
                  <div className="text-muted small mt-3">
                    <Badge bg="light" text="dark" className="me-2">
                      {lesson.content.vocabulary.length} слів
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default LessonList; 