import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Table, Modal } from 'react-bootstrap';

const AdminPanel = () => {
  const [lessons, setLessons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState({
    title: '',
    order: 1,
    content: {
      text: '',
      vocabulary: []
    }
  });

  const [newWord, setNewWord] = useState({
    swedishWord: '',
    ukrainianTranslation: ''
  });

  // Завантаження списку уроків
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lessons');
      const data = await response.json();
      setLessons(data);
      setLoading(false);
    } catch (error) {
      console.error('Помилка завантаження уроків:', error);
      setLoading(false);
    }
  };

  const handleAddWord = () => {
    if (newWord.swedishWord && newWord.ukrainianTranslation) {
      setLessonData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          vocabulary: [...prev.content.vocabulary, { ...newWord }]
        }
      }));
      setNewWord({ swedishWord: '', ukrainianTranslation: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Відправляємо дані:', lessonData);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необхідно увійти в систему');
      }

      const response = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lessonData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка при створенні уроку');
      }

      console.log('Урок успішно створено:', data);
      alert('Урок успішно створено!');
      
      setShowAddModal(false);
      fetchLessons();
      setLessonData({
        title: '',
        order: 1,
        content: {
          text: '',
          vocabulary: []
        }
      });
    } catch (error) {
      console.error('Помилка:', error);
      alert(`Помилка: ${error.message}`);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей урок?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/lessons/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchLessons();
        }
      } catch (error) {
        console.error('Помилка видалення уроку:', error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Панель адміністратора</h2>
        <Button onClick={() => setShowAddModal(true)}>Додати новий урок</Button>
      </div>

      {loading ? (
        <div className="text-center">Завантаження...</div>
      ) : (
        <Card>
          <Card.Body>
            <h3 className="mb-3">Список уроків</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Назва</th>
                  <th>Кількість слів</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson._id}>
                    <td>{lesson.order}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.content.vocabulary.length}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => {/* Додати логіку редагування */}}
                      >
                        Редагувати
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson._id)}
                      >
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Додати новий урок</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Назва уроку</Form.Label>
              <Form.Control
                type="text"
                value={lessonData.title}
                onChange={(e) => setLessonData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Порядковий номер</Form.Label>
              <Form.Control
                type="number"
                value={lessonData.order}
                onChange={(e) => setLessonData(prev => ({
                  ...prev,
                  order: parseInt(e.target.value)
                }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Текст уроку</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={lessonData.content.text}
                onChange={(e) => setLessonData(prev => ({
                  ...prev,
                  content: {
                    ...prev.content,
                    text: e.target.value
                  }
                }))}
              />
            </Form.Group>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Словник</Card.Title>
                <div className="d-flex mb-3">
                  <Form.Control
                    className="me-2"
                    placeholder="Шведське слово"
                    value={newWord.swedishWord}
                    onChange={(e) => setNewWord(prev => ({
                      ...prev,
                      swedishWord: e.target.value
                    }))}
                  />
                  <Form.Control
                    className="me-2"
                    placeholder="Український переклад"
                    value={newWord.ukrainianTranslation}
                    onChange={(e) => setNewWord(prev => ({
                      ...prev,
                      ukrainianTranslation: e.target.value
                    }))}
                  />
                  <Button onClick={handleAddWord}>Додати</Button>
                </div>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Шведською</th>
                      <th>Українською</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessonData.content.vocabulary.map((word, index) => (
                      <tr key={index}>
                        <td>{word.swedishWord}</td>
                        <td>{word.ukrainianTranslation}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => {
                              setLessonData(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  vocabulary: prev.content.vocabulary.filter((_, i) => i !== index)
                                }
                              }));
                            }}
                          >
                            Видалити
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                Скасувати
              </Button>
              <Button type="submit">Зберегти урок</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel; 