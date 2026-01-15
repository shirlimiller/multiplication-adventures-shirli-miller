import { useState, useCallback } from 'react';
import { ProfileSelectionScreen } from '@/components/game/ProfileSelectionScreen';
import { PlayerDashboard } from '@/components/game/PlayerDashboard';
import { SetupScreen } from '@/components/game/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { SummaryScreen } from '@/components/game/SummaryScreen';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { GameState, INITIAL_STATE, generateAdaptiveQuestion, AnsweredQuestion } from '@/lib/gameUtils';
import { Player } from '@/lib/playerTypes';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';

type AppScreen = 'profiles' | 'dashboard' | 'setup' | 'game' | 'summary';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('profiles');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const {
    players,
    isLoaded,
    addPlayer,
    deletePlayer,
    resetPlayerHistory,
    getPlayerStats,
    updatePlayerStats,
  } = usePlayerStorage();

  // Handle player selection
  const handleSelectPlayer = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setCurrentScreen('dashboard');
  }, []);

  // Go back to profiles
  const handleBackToProfiles = useCallback(() => {
    setSelectedPlayer(null);
    setCurrentScreen('profiles');
  }, []);

  // Start setup (choose tables)
  const handleStartSetup = useCallback(() => {
    setCurrentScreen('setup');
  }, []);

  // Back to dashboard
  const handleBackToDashboard = useCallback(() => {
    setCurrentScreen('dashboard');
  }, []);

  // Start the game with adaptive question generation
  const handleStartGame = useCallback((tables: number[], questionCount: number) => {
    if (!selectedPlayer) return;
    
    const playerStats = getPlayerStats(selectedPlayer.id);
    const { multiplier, multiplicand, answer } = generateAdaptiveQuestion(tables, playerStats, []);
    
    setGameState({
      ...INITIAL_STATE,
      currentScreen: 'game',
      selectedTables: tables,
      questionCount,
      currentMultiplier: multiplier,
      currentMultiplicand: multiplicand,
      correctAnswer: answer,
      questionStartTime: Date.now(),
      mistakeCount: 0,
    });
    setCurrentScreen('game');
  }, [selectedPlayer, getPlayerStats]);

  // Handle answer
  const handleAnswer = useCallback((answer: number, isCorrect: boolean, responseTimeMs: number) => {
    const newQuestion: AnsweredQuestion = {
      multiplier: gameState.currentMultiplier,
      multiplicand: gameState.currentMultiplicand,
      correctAnswer: gameState.correctAnswer,
      userAnswer: answer,
      isCorrect,
      responseTimeMs,
    };

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showFeedback: true,
      isCorrect,
      score: isCorrect ? prev.score + 10 : prev.score,
      stars: isCorrect ? prev.stars + 1 : prev.stars,
      answeredQuestions: [...prev.answeredQuestions, newQuestion],
      mistakeCount: isCorrect ? prev.mistakeCount : prev.mistakeCount + 1,
    }));
  }, [gameState.currentMultiplier, gameState.currentMultiplicand, gameState.correctAnswer]);

  // Continue to next question with adaptive selection
  const handleContinue = useCallback(() => {
    const nextQuestion = gameState.currentQuestion + 1;
    
    if (nextQuestion >= gameState.questionCount) {
      // Game over - save stats
      if (selectedPlayer) {
        updatePlayerStats(
          selectedPlayer.id,
          gameState.answeredQuestions,
          gameState.selectedTables,
          gameState.stars + (gameState.isCorrect ? 1 : 0) // Include last answer
        );
      }
      setCurrentScreen('summary');
    } else {
      // Generate next question adaptively based on player stats
      const playerStats = selectedPlayer ? getPlayerStats(selectedPlayer.id) : null;
      const { multiplier, multiplicand, answer } = playerStats
        ? generateAdaptiveQuestion(gameState.selectedTables, playerStats, gameState.answeredQuestions)
        : { multiplier: gameState.selectedTables[0], multiplicand: 1, answer: gameState.selectedTables[0] };
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        currentMultiplier: multiplier,
        currentMultiplicand: multiplicand,
        correctAnswer: answer,
        userAnswer: null,
        showFeedback: false,
        isCorrect: null,
        questionStartTime: Date.now(),
      }));
    }
  }, [gameState, selectedPlayer, updatePlayerStats, getPlayerStats]);

  // Play again with same settings
  const handlePlayAgain = useCallback(() => {
    handleStartGame(gameState.selectedTables, gameState.questionCount);
  }, [gameState.selectedTables, gameState.questionCount, handleStartGame]);

  // Change settings
  const handleChangeSettings = useCallback(() => {
    setCurrentScreen('setup');
  }, []);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-2xl animate-pulse">טוען... 🦊</div>
      </div>
    );
  }

  // Get current player stats
  const currentStats = selectedPlayer ? getPlayerStats(selectedPlayer.id) : null;

  return (
    <>
      {/* Profile Selection */}
      {currentScreen === 'profiles' && (
        <ProfileSelectionScreen
          players={players}
          onSelectPlayer={handleSelectPlayer}
          onAddPlayer={addPlayer}
          onDeletePlayer={deletePlayer}
          onResetHistory={resetPlayerHistory}
          getPlayerStats={getPlayerStats}
        />
      )}

      {/* Player Dashboard */}
      {currentScreen === 'dashboard' && selectedPlayer && currentStats && (
        <PlayerDashboard
          player={selectedPlayer}
          stats={currentStats}
          onBack={handleBackToProfiles}
          onStartGame={handleStartSetup}
        />
      )}

      {/* Setup Screen */}
      {currentScreen === 'setup' && selectedPlayer && currentStats && (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
          <div className="p-4">
            <PlayerHeader 
              player={selectedPlayer} 
              stats={currentStats} 
              onBack={handleBackToDashboard} 
            />
          </div>
          <div className="flex-1">
            <SetupScreen 
              onStartGame={handleStartGame}
              conqueredTables={currentStats.conqueredTables}
            />
          </div>
        </div>
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && selectedPlayer && currentStats && (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
          <div className="p-4">
            <PlayerHeader 
              player={selectedPlayer} 
              stats={currentStats} 
              onBack={handleBackToDashboard} 
            />
          </div>
          <GameScreen
            multiplier={gameState.currentMultiplier}
            multiplicand={gameState.currentMultiplicand}
            correctAnswer={gameState.correctAnswer}
            currentQuestion={gameState.currentQuestion}
            totalQuestions={gameState.questionCount}
            score={gameState.score}
            stars={gameState.stars}
            mistakeCount={gameState.mistakeCount}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            showFeedback={gameState.showFeedback}
            isCorrect={gameState.isCorrect}
            questionStartTime={gameState.questionStartTime}
          />
        </div>
      )}

      {/* Summary Screen */}
      {currentScreen === 'summary' && selectedPlayer && currentStats && (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
          <div className="p-4">
            <PlayerHeader 
              player={selectedPlayer} 
              stats={getPlayerStats(selectedPlayer.id)} 
              onBack={handleBackToDashboard} 
            />
          </div>
          <SummaryScreen
            answeredQuestions={gameState.answeredQuestions}
            score={gameState.score}
            stars={gameState.stars}
            selectedTables={gameState.selectedTables}
            playerStats={getPlayerStats(selectedPlayer.id)}
            onPlayAgain={handlePlayAgain}
            onChangeSettings={handleChangeSettings}
          />
        </div>
      )}
    </>
  );
};

export default Index;
