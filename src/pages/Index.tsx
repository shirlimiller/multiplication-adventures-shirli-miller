import { useState, useCallback } from 'react';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { SetupScreen } from '@/components/game/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { SummaryScreen } from '@/components/game/SummaryScreen';
import { GameState, INITIAL_STATE, generateQuestion, AnsweredQuestion } from '@/lib/gameUtils';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const handleStartSetup = useCallback(() => {
    setGameState(prev => ({ ...prev, currentScreen: 'setup' }));
  }, []);

  const handleStartGame = useCallback((tables: number[], questionCount: number) => {
    const { multiplier, multiplicand, answer } = generateQuestion(tables);
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'game',
      selectedTables: tables,
      questionCount,
      currentQuestion: 0,
      score: 0,
      stars: 0,
      currentMultiplier: multiplier,
      currentMultiplicand: multiplicand,
      correctAnswer: answer,
      userAnswer: null,
      showFeedback: false,
      isCorrect: null,
      answeredQuestions: [],
    }));
  }, []);

  const handleAnswer = useCallback((answer: number, isCorrect: boolean) => {
    const newQuestion: AnsweredQuestion = {
      multiplier: gameState.currentMultiplier,
      multiplicand: gameState.currentMultiplicand,
      correctAnswer: gameState.correctAnswer,
      userAnswer: answer,
      isCorrect,
    };

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showFeedback: true,
      isCorrect,
      score: isCorrect ? prev.score + 10 : prev.score,
      stars: isCorrect ? prev.stars + 1 : prev.stars,
      answeredQuestions: [...prev.answeredQuestions, newQuestion],
    }));
  }, [gameState.currentMultiplier, gameState.currentMultiplicand, gameState.correctAnswer]);

  const handleContinue = useCallback(() => {
    const nextQuestion = gameState.currentQuestion + 1;
    
    if (nextQuestion >= gameState.questionCount) {
      // Game over, show summary
      setGameState(prev => ({
        ...prev,
        currentScreen: 'summary',
      }));
    } else {
      // Next question
      const { multiplier, multiplicand, answer } = generateQuestion(gameState.selectedTables);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        currentMultiplier: multiplier,
        currentMultiplicand: multiplicand,
        correctAnswer: answer,
        userAnswer: null,
        showFeedback: false,
        isCorrect: null,
      }));
    }
  }, [gameState.currentQuestion, gameState.questionCount, gameState.selectedTables]);

  const handlePlayAgain = useCallback(() => {
    handleStartGame(gameState.selectedTables, gameState.questionCount);
  }, [gameState.selectedTables, gameState.questionCount, handleStartGame]);

  const handleChangeSettings = useCallback(() => {
    setGameState(prev => ({ ...prev, currentScreen: 'setup' }));
  }, []);

  return (
    <>
      {gameState.currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartSetup} />
      )}
      
      {gameState.currentScreen === 'setup' && (
        <SetupScreen 
          onStartGame={handleStartGame}
          conqueredTables={gameState.conqueredTables}
        />
      )}
      
      {gameState.currentScreen === 'game' && (
        <GameScreen
          multiplier={gameState.currentMultiplier}
          multiplicand={gameState.currentMultiplicand}
          correctAnswer={gameState.correctAnswer}
          currentQuestion={gameState.currentQuestion}
          totalQuestions={gameState.questionCount}
          score={gameState.score}
          stars={gameState.stars}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
          showFeedback={gameState.showFeedback}
          isCorrect={gameState.isCorrect}
        />
      )}
      
      {gameState.currentScreen === 'summary' && (
        <SummaryScreen
          answeredQuestions={gameState.answeredQuestions}
          score={gameState.score}
          stars={gameState.stars}
          selectedTables={gameState.selectedTables}
          onPlayAgain={handlePlayAgain}
          onChangeSettings={handleChangeSettings}
        />
      )}
    </>
  );
};

export default Index;
