import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Статичні дані уроків
const lessonsData = [
  {
    id: 1,
    title: 'Урок 1: Att hälsa och presentera sig',
    order: 1,
    content: {
      text: `Hej! Jag heter Anna. Jag är 25 år gammal och kommer från Sverige. Just nu bor jag i Stockholm och studerar vid universitetet. Jag tycker om att läsa böcker och promenera i naturen.

Jag har nyligen flyttat hit för att fortsätta min utbildning i litteraturvetenskap. På fritiden gillar jag också att laga mat och träffa vänner på kaféer. Vi pratar ofta om böcker, filmer och resor. Jag tycker att det är viktigt att hälsa artigt när man träffar nya människor.

När jag möter någon för första gången säger jag ofta: "Hej, jag heter Anna!" och frågar vad den personen heter. På så sätt blir samtalet mer personligt och trevligt. Det är spännande att lära känna nya personer och höra deras historier.`,
      vocabulary: [
        { swedishWord: 'att', transcription: '[at]', ukrainianTranslation: 'що, щоб' },
        { swedishWord: 'hälsa', transcription: '[ˈhɛlsa]', ukrainianTranslation: 'вітати' },
        { swedishWord: 'och', transcription: '[ɔk]', ukrainianTranslation: 'і' }
      ]
    }
  }
];

const LessonsList = () => {
  return (
    <div className="mt-4">
      <h2 className="text-center mb-5">Уроки шведської мови</h2>
      <Row className="justify-content-center">
        {lessonsData.map((lesson) => (
          <Col key={lesson.id} xs={12} md={8} lg={6}>
            <Card className="shadow-sm hover-shadow">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title className="h4 mb-0">
                    {lesson.title}
                  </Card.Title>
                  <Badge bg="primary" pill className="px-3 py-2">
                    Урок {lesson.order}
                  </Badge>
                </div>
                <Card.Text className="mb-4 text-muted">
                  {lesson.content.text.substring(0, 200)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Слів у словнику: {lesson.content.vocabulary.length}
                  </small>
                  <Link 
                    to={`/lesson/${lesson.id}`} 
                    className="btn btn-primary px-4"
                  >
                    Перейти до уроку
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease-in-out;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default LessonsList; 