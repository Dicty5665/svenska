import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import { FaCheck, FaTrash, FaBook, FaDownload, FaUpload, FaGraduationCap, FaRedo } from 'react-icons/fa';
import WordQuiz from './WordQuiz';

const UserProfile = () => {
  const [savedWords, setSavedWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const fileInputRef = useRef();
  
  useEffect(() => {
    // Завантажуємо збережені слова з localStorage
    const saved = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const learned = JSON.parse(localStorage.getItem('learnedWords') || '[]');
    setSavedWords(saved);
    setLearnedWords(learned);
  }, []);

  const markAsLearned = (word) => {
    const newLearnedWords = [...learnedWords, word];
    const newSavedWords = savedWords.filter(w => w.swedishWord !== word.swedishWord);
    
    setLearnedWords(newLearnedWords);
    setSavedWords(newSavedWords);
    
    localStorage.setItem('learnedWords', JSON.stringify(newLearnedWords));
    localStorage.setItem('savedWords', JSON.stringify(newSavedWords));
  };

  const deleteWord = (word, isLearned = false) => {
    if (isLearned) {
      const newLearnedWords = learnedWords.filter(w => w.swedishWord !== word.swedishWord);
      setLearnedWords(newLearnedWords);
      localStorage.setItem('learnedWords', JSON.stringify(newLearnedWords));
    } else {
      const newSavedWords = savedWords.filter(w => w.swedishWord !== word.swedishWord);
      setSavedWords(newSavedWords);
      localStorage.setItem('savedWords', JSON.stringify(newSavedWords));
    }
  };

  const startQuiz = (isRevision = false, type) => {
    setQuizWords(isRevision ? learnedWords : savedWords);
    setIsRevisionMode(isRevision);
    setQuizType(type);
    setShowQuiz(true);
  };

  const handleQuizComplete = (success) => {
    if (!isRevisionMode && success) {
      // Переміщуємо всі слова до вивчених
      const newLearnedWords = [...learnedWords, ...savedWords];
      setLearnedWords(newLearnedWords);
      setSavedWords([]);
      localStorage.setItem('learnedWords', JSON.stringify(newLearnedWords));
      localStorage.setItem('savedWords', JSON.stringify([]));
    }
    setShowQuiz(false);
  };

  const exportDictionary = () => {
    const dictionary = {
      savedWords,
      learnedWords,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dictionary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `svenska-dictionary-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDictionary = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dictionary = JSON.parse(e.target.result);
          if (dictionary.savedWords && dictionary.learnedWords) {
            setSavedWords(dictionary.savedWords);
            setLearnedWords(dictionary.learnedWords);
            localStorage.setItem('savedWords', JSON.stringify(dictionary.savedWords));
            localStorage.setItem('learnedWords', JSON.stringify(dictionary.learnedWords));
            alert('Словник успішно імпортовано!');
          }
        } catch (error) {
          alert('Помилка при імпорті файлу. Переконайтеся, що файл має правильний формат.');
        }
      };
      reader.readAsText(file);
    }
  };

  const totalWords = savedWords.length + learnedWords.length;
  const progress = totalWords ? (learnedWords.length / totalWords) * 100 : 0;

  if (showQuiz) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            {isRevisionMode ? 'Повторення вивчених слів' : 'Тестування нових слів'}
          </h2>
          <Button 
            variant="outline-secondary"
            onClick={() => {
              setShowQuiz(false);
              setQuizType(null);
            }}
          >
            Повернутися до профілю
          </Button>
        </div>
        <WordQuiz 
          words={quizWords}
          onComplete={handleQuizComplete}
          isRevision={isRevisionMode}
          quizType={quizType}
        />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Мій профіль</h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importDictionary}
            accept=".json"
            style={{ display: 'none' }}
          />
          <Button 
            variant="outline-primary"
            className="me-2"
            onClick={() => fileInputRef.current.click()}
          >
            <FaUpload className="me-2" />
            Імпортувати словник
          </Button>
          <Button 
            variant="outline-success"
            onClick={exportDictionary}
          >
            <FaDownload className="me-2" />
            Експортувати словник
          </Button>
        </div>
      </div>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5 mb-0">Прогрес вивчення слів</h3>
            <Badge bg="success" className="px-3 py-2">
              {learnedWords.length} з {totalWords} слів вивчено
            </Badge>
          </div>
          <ProgressBar 
            now={progress} 
            label={`${Math.round(progress)}%`}
            variant="success"
            className="mb-3"
          />
          <div className="text-muted small">
            <FaBook className="me-2" />
            Всього слів у вашому словнику: {totalWords}
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title className="mb-0">Слова для вивчення</Card.Title>
            {savedWords.length > 0 && (
              <div>
                <Button 
                  variant="success"
                  onClick={() => startQuiz(false, 'ua-to-sv')}
                  className="me-2"
                >
                  <FaGraduationCap className="me-2" />
                  Українська → Шведська
                </Button>
                <Button 
                  variant="success"
                  onClick={() => startQuiz(false, 'sv-to-ua')}
                >
                  <FaGraduationCap className="me-2" />
                  Шведська → Українська
                </Button>
              </div>
            )}
          </div>
          {savedWords.length === 0 ? (
            <p className="text-muted text-center py-4">
              У вас поки немає збережених слів для вивчення
            </p>
          ) : (
            <Table hover>
              <thead>
                <tr>
                  <th>Шведською</th>
                  <th>Транскрипція</th>
                  <th>Українською</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {savedWords.map((word, index) => (
                  <tr key={index}>
                    <td className="align-middle">{word.swedishWord}</td>
                    <td className="align-middle">{word.transcription}</td>
                    <td className="align-middle">{word.ukrainianTranslation}</td>
                    <td className="align-middle">
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => markAsLearned(word)}
                        title="Позначити як вивчене"
                      >
                        <FaCheck />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => deleteWord(word)}
                        title="Видалити"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title className="mb-0">Вивчені слова</Card.Title>
            {learnedWords.length > 0 && (
              <div>
                <Button 
                  variant="primary"
                  onClick={() => startQuiz(true, 'ua-to-sv')}
                  className="me-2"
                >
                  <FaRedo className="me-2" />
                  Українська → Шведська
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => startQuiz(true, 'sv-to-ua')}
                >
                  <FaRedo className="me-2" />
                  Шведська → Українська
                </Button>
              </div>
            )}
          </div>
          {learnedWords.length === 0 ? (
            <p className="text-muted text-center py-4">
              Ви ще не позначили жодного слова як вивчене
            </p>
          ) : (
            <Table hover>
              <thead>
                <tr>
                  <th>Шведською</th>
                  <th>Транскрипція</th>
                  <th>Українською</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {learnedWords.map((word, index) => (
                  <tr key={index}>
                    <td className="align-middle">{word.swedishWord}</td>
                    <td className="align-middle">{word.transcription}</td>
                    <td className="align-middle">{word.ukrainianTranslation}</td>
                    <td className="align-middle">
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => deleteWord(word, true)}
                        title="Видалити"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile; 