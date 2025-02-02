import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { FaFilePdf, FaPrint, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { lessonsData } from '../data/lessons';
import { dictionary } from '../data/dictionary';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newWords, setNewWords] = useState([]);
  const lessonContentRef = useRef(null);
  
  // Знаходимо урок за id
  const lesson = lessonsData.find(lesson => lesson.id === Number(id));

  const addToNewWords = (word) => {
    if (!newWords.find(w => w.swedishWord === word.swedishWord)) {
      const updatedWords = [...newWords, word];
      setNewWords(updatedWords);
      
      // Зберігаємо в localStorage
      const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
      if (!savedWords.find(w => w.swedishWord === word.swedishWord)) {
        localStorage.setItem('savedWords', JSON.stringify([...savedWords, word]));
      }
    }
  };

  const removeFromNewWords = (word) => {
    setNewWords(newWords.filter(w => w.swedishWord !== word.swedishWord));
    
    // Видаляємо з localStorage
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const updatedSavedWords = savedWords.filter(w => w.swedishWord !== word.swedishWord);
    localStorage.setItem('savedWords', JSON.stringify(updatedSavedWords));
  };

  const handleWordClick = (e) => {
    if (e.target.classList.contains('interactive-word')) {
      const word = JSON.parse(decodeURIComponent(e.target.dataset.word));
      addToNewWords(word);
    }
  };

  const renderInteractiveText = (text) => {
    if (!text) return '';
    
    let result = text;
    
    // Створюємо масив слів зі словника, відсортований за довжиною
    const dictionaryWords = Object.entries(dictionary)
      .map(([word, data]) => ({
        swedishWord: word,
        ...data
      }))
      .sort((a, b) => b.swedishWord.length - a.swedishWord.length);

    dictionaryWords.forEach(word => {
      try {
        // Екрануємо спеціальні символи в слові
        const escapedWord = word.swedishWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Використовуємо негативний lookahead і lookbehind для точного співпадіння слів
        const regex = new RegExp(
          `(?<![-\\wåäöÅÄÖ])${escapedWord}(?![-\\wåäöÅÄÖ])`,
          'gi'
        );
        
        const wordData = encodeURIComponent(JSON.stringify({
          swedishWord: word.swedishWord,
          transcription: word.transcription,
          ukrainianTranslation: word.ukrainianTranslation
        }));
        
        const isAdded = newWords.some(w => w.swedishWord.toLowerCase() === word.swedishWord.toLowerCase());
        
        // Зберігаємо оригінальний регістр знайденого слова
        result = result.replace(regex, match => 
          `<span class="interactive-word${isAdded ? ' added' : ''}" 
            data-word="${wordData}" 
            data-translation="${word.ukrainianTranslation}"
          >${match}</span>`
        );
      } catch (error) {
        console.error(`Помилка при обробці слова "${word.swedishWord}":`, error);
      }
    });
    
    return result;
  };

  const renderInteractiveTitle = (title) => {
    return renderInteractiveText(title);
  };

  const handlePrint = () => {
    window.print();
  };

  // Функція для аналізу тексту та пошуку відсутніх слів
  const analyzeMissingWords = (text) => {
    // Розбиваємо текст на слова
    const words = text.match(/[A-Za-zåäöÅÄÖ]+/g) || [];
    
    // Створюємо Set унікальних слів
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    
    // Знаходимо слова, яких немає в словнику
    const missingWords = Array.from(uniqueWords)
      .filter(word => !dictionary[word])
      .sort();

    console.log('Слова, які відсутні в словнику:', missingWords);
    return missingWords;
  };

  // Аналізуємо текст при завантаженні компонента
  useEffect(() => {
    if (lesson) {
      console.log('Аналіз тексту уроку:', lesson.title);
      const missingWords = analyzeMissingWords(lesson.content.text);
      console.log(`Знайдено ${missingWords.length} відсутніх слів`);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h2>Урок не знайдено</h2>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            className="mt-3"
          >
            Повернутися до списку уроків
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            .container {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 15px !important;
            }
            
            h2 {
              font-size: 1.5rem !important;
              margin-bottom: 1rem !important;
            }
            
            .card {
              border: none !important;
              box-shadow: none !important;
            }
            
            .card-body {
              padding: 1rem !important;
            }
            
            .card-title {
              font-size: 1.2rem !important;
              margin-bottom: 0.5rem !important;
              padding-bottom: 0.5rem !important;
            }
            
            .text-muted, .btn, .badge {
              display: none !important;
            }
            
            div[dangerouslySetInnerHTML] {
              font-size: 1rem !important;
              line-height: 1.5 !important;
            }
            
            table {
              font-size: 0.9rem !important;
            }
            
            .interactive-word {
              text-decoration: none !important;
              color: inherit !important;
              border-bottom: none !important;
            }
          }

          .shadow-sm {
            transition: box-shadow 0.3s ease-in-out;
          }
          .shadow-sm:hover {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
          }
          .interactive-word {
            text-decoration: underline;
            cursor: pointer;
            position: relative;
            display: inline-block;
          }
          .interactive-word:hover::after {
            content: attr(data-translation);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
          }
          .interactive-word.added {
            background-color: #e8f5e9;
          }
        `}
      </style>
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0" 
                onClick={handleWordClick}
                dangerouslySetInnerHTML={{ __html: renderInteractiveTitle(lesson.title) }}
            ></h2>
            <p className="text-muted mt-2 mb-0">
              Натисніть на підкреслені слова, щоб додати їх до свого словника
            </p>
          </div>
          <div className="d-flex gap-2">
            <ButtonGroup>
              <Button 
                variant="outline-primary"
                onClick={handlePrint}
                title="Друкувати урок"
              >
                <FaPrint /> Друк
              </Button>
            </ButtonGroup>
            <Button 
              variant="outline-secondary"
              onClick={() => navigate('/')}
            >
              До списку уроків
            </Button>
          </div>
        </div>
        
        <div ref={lessonContentRef}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">
              <Card.Title className="border-bottom pb-3 mb-4">Текст уроку</Card.Title>
              <div 
                onClick={handleWordClick}
                style={{ 
                  whiteSpace: 'pre-line',
                  fontSize: '1.2rem',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ __html: renderInteractiveText(lesson.content.text) }}
              />
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <Card.Title className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
                <span>Мій словник</span>
                {newWords.length > 0 && (
                  <Badge bg="primary" pill className="px-3 py-2">
                    {newWords.length} {newWords.length === 1 ? 'слово' : newWords.length < 5 ? 'слова' : 'слів'}
                  </Badge>
                )}
              </Card.Title>
              
              {newWords.length === 0 ? (
                <p className="text-muted text-center py-4">
                  Натисніть на підкреслені слова в тексті, щоб додати їх до свого словника
                </p>
              ) : (
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th className="border-0">Шведською</th>
                      <th className="border-0">Транскрипція</th>
                      <th className="border-0">Українською</th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newWords.map((word, index) => (
                      <tr key={index}>
                        <td className="align-middle py-3">
                          <span className="fw-medium">{word.swedishWord}</span>
                        </td>
                        <td className="align-middle py-3">
                          {word.transcription}
                        </td>
                        <td className="align-middle py-3">
                          {word.ukrainianTranslation}
                        </td>
                        <td className="align-middle py-3 text-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeFromNewWords(word)}
                          >
                            Видалити
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default LessonView; 