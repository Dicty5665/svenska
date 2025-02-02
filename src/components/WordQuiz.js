import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes, FaRedo } from 'react-icons/fa';

const WordQuiz = ({ words, onComplete, isRevision = false, quizType }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [remainingWords, setRemainingWords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setRemainingWords([...words]);
  }, [words]);

  const getRandomOptions = (correctWord, allWords) => {
    const otherWords = allWords.filter(w => w !== correctWord);
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    const wrongOptions = shuffled.slice(0, 2);
    
    const options = [
      {
        text: quizType === 'ua-to-sv' ? correctWord.swedishWord : correctWord.ukrainianTranslation,
        isCorrect: true
      },
      ...wrongOptions.map(word => ({
        text: quizType === 'ua-to-sv' ? word.swedishWord : word.ukrainianTranslation,
        isCorrect: false
      }))
    ];

    return options.sort(() => 0.5 - Math.random());
  };

  const startNewQuestion = () => {
    if (remainingWords.length === 0) {
      setShowResult(true);
      if (onComplete) {
        onComplete(score / words.length >= 0.8);
      }
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const word = remainingWords[randomIndex];
    const newRemainingWords = remainingWords.filter((_, index) => index !== randomIndex);
    
    setRemainingWords(newRemainingWords);
    setCurrentWord(word);
    setOptions(getRandomOptions(word, words));
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option.isCorrect;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setProgress((words.length - remainingWords.length + 1) / words.length * 100);
      startNewQuestion();
    }, 1500);
  };

  useEffect(() => {
    if (remainingWords.length > 0 && !currentWord) {
      startNewQuestion();
    }
  }, [remainingWords, currentWord]);

  if (showResult) {
    return (
      <Card className="text-center p-4">
        <h3 className="mb-4">Результат</h3>
        <div className="display-4 mb-3">{Math.round(score / words.length * 100)}%</div>
        <p className="mb-4">
          Правильних відповідей: {score} з {words.length}
        </p>
        {score / words.length >= 0.8 ? (
          <Alert variant="success">
            Вітаємо! Ви успішно вивчили ці слова!
          </Alert>
        ) : (
          <Alert variant="warning">
            Спробуйте ще раз для кращого результату
          </Alert>
        )}
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
          className="mt-3"
        >
          <FaRedo className="me-2" />
          Спробувати ще раз
        </Button>
      </Card>
    );
  }

  return (
    <Card className="quiz-card">
      <Card.Body className="p-4">
        <div className="mb-4">
          <ProgressBar 
            now={progress} 
            label={`${Math.round(progress)}%`}
            variant="success"
          />
        </div>

        {currentWord && (
          <>
            <div className="text-center mb-4">
              <h3 className="mb-3">
                {quizType === 'ua-to-sv' ? currentWord.ukrainianTranslation : currentWord.swedishWord}
              </h3>
              {quizType === 'sv-to-ua' && (
                <div className="text-muted mb-3">{currentWord.transcription}</div>
              )}
              <p className="text-muted">
                {quizType === 'ua-to-sv' ? "Оберіть шведський переклад:" : "Оберіть український переклад:"}
              </p>
            </div>

            <div className="d-grid gap-3">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedOption === null ? "outline-primary" :
                    option === selectedOption ? (isCorrect ? "success" : "danger") :
                    option.isCorrect ? "success" : "outline-primary"
                  }
                  onClick={() => handleOptionClick(option)}
                  className="py-3"
                  disabled={selectedOption !== null}
                >
                  {option.text}
                  {selectedOption !== null && option === selectedOption && (
                    <span className="ms-2">
                      {isCorrect ? <FaCheck /> : <FaTimes />}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default WordQuiz; 