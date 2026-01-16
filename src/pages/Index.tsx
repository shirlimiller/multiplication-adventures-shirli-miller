import { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ProfileSelectionScreen } from '@/components/game/ProfileSelectionScreen';
import { PlayerDashboard } from '@/components/game/PlayerDashboard';
import { SetupScreen } from '@/components/game/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { SummaryScreen } from '@/components/game/SummaryScreen';
import { BossChallenge } from '@/components/game/BossChallenge';
import { 
  GameState, 
  INITIAL_STATE, 
  AnsweredQuestion,
  generateAdaptiveQuestion,
} from '@/lib/gameUtils';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';

type Screen = 'welcome' | 'profiles' | 'dashboard' | 'setup' | 'game' | 'summary' | 'boss';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentStats, setCurrentStats] = useState<PlayerStats | null>(null);
  const [bossTable, setBossTable] = useState<number | null>(null);
  
  const { 
    players, 
    isLoaded, 
    addPlayer, 
    deletePlayer, 
    resetPlayerHistory,
    getPlayerStats,
    updatePlayerStats 
  } = usePlayerStorage();

  // Update current stats when player changes
  useEffect(() => {
    if (selectedPlayer) {
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
  }, [selectedPlayer, getPlayerStats]);

  const handleStart = () => {
    setCurrentScreen('profiles');
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentStats(getPlayerStats(player.id));
    setCurrentScreen('dashboard');
  };

  const handleBackToProfiles = () => {
    setSelectedPlayer(null);
    setCurrentStats(null);
    setCurrentScreen('profiles');
  };

  const handleStartSetup = () => {
    setCurrentScreen('setup');
  };

  // Start game with adaptive question generation
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
      streak: 0,
    });
    setCurrentScreen('game');
  }, [selectedPlayer, getPlayerStats]);

  // Handle answer with star calculation
  const handleAnswer = useCallback((answer: number, isCorrect: boolean, responseTimeMs: number, starsEarned: number) => {
    const newQuestion: AnsweredQuestion = {
      multiplier: gameState.currentMultiplier,
      multiplicand: gameState.currentMultiplicand,
      correctAnswer: gameState.correctAnswer,
      userAnswer: answer,
      isCorrect,
      responseTimeMs,
      starsEarned,
    };

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showFeedback: true,
      isCorrect,
      score: isCorrect ? prev.score + 10 : prev.score,
      stars: prev.stars + starsEarned,
      streak: isCorrect ? prev.streak + 1 : 0, // Reset streak on wrong answer
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
        const totalStars = gameState.answeredQuestions.reduce((sum, q) => sum + q.starsEarned, 0);
        updatePlayerStats(
          selectedPlayer.id,
          gameState.answeredQuestions,
          gameState.selectedTables,
          totalStars
        );
        // Refresh stats
        setCurrentStats(getPlayerStats(selectedPlayer.id));
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

  // Boss challenge handlers
  const handleBossUnlock = useCallback(() => {
    if (gameState.currentMultiplier) {
      setBossTable(gameState.currentMultiplier);
      setCurrentScreen('boss');
    }
  }, [gameState.currentMultiplier]);

  const handleBossComplete = useCallback((success: boolean) => {
    if (success && selectedPlayer && bossTable) {
      // Add table to conquered tables
      const stats = getPlayerStats(selectedPlayer.id);
      if (!stats.conqueredTables.includes(bossTable)) {
        // Update conqueredTables directly
        const updatedStats = {
          ...stats,
          conqueredTables: [...stats.conqueredTables, bossTable],
        };
        // Save to storage (we'll need to update the storage hook)
      }
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
    
    setBossTable(null);
    setCurrentScreen('game');
  }, [selectedPlayer, bossTable, getPlayerStats]);

  const handleBossExit = useCallback(() => {
    setBossTable(null);
    setCurrentScreen('game');
  }, []);

  const handlePlayAgain = () => {
    setCurrentScreen('setup');
  };

  const handleReturnToMenu = () => {
    setCurrentScreen('dashboard');
    // Refresh stats
    if (selectedPlayer) {
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl font-bold text-primary animate-pulse">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Welcome Screen */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

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

      {/* Game Setup */}
      {currentScreen === 'setup' && selectedPlayer && currentStats && (
        <SetupScreen
          onStartGame={handleStartGame}
          conqueredTables={currentStats.conqueredTables}
        />
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && selectedPlayer && currentStats && (
        <GameScreen
          multiplier={gameState.currentMultiplier}
          multiplicand={gameState.currentMultiplicand}
          correctAnswer={gameState.correctAnswer}
          currentQuestion={gameState.currentQuestion}
          totalQuestions={gameState.questionCount}
          score={gameState.score}
          stars={gameState.stars}
          streak={gameState.streak}
          mistakeCount={gameState.mistakeCount}
          totalStars={currentStats.totalStars}
          playerStats={currentStats}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
          onBossUnlock={handleBossUnlock}
          showFeedback={gameState.showFeedback}
          isCorrect={gameState.isCorrect}
          questionStartTime={gameState.questionStartTime}
        />
      )}

      {/* Boss Challenge */}
      {currentScreen === 'boss' && bossTable && (
        <BossChallenge
          table={bossTable}
          onComplete={handleBossComplete}
          onExit={handleBossExit}
        />
      )}

      {/* Summary Screen */}
      {currentScreen === 'summary' && selectedPlayer && (
        <SummaryScreen
          score={gameState.score}
          stars={gameState.stars}
          answeredQuestions={gameState.answeredQuestions}
          selectedTables={gameState.selectedTables}
          onPlayAgain={handlePlayAgain}
          onChangeSettings={handleReturnToMenu}
          playerStats={getPlayerStats(selectedPlayer.id)}
        />
      )}
    </div>
  );
};

export default Index;
