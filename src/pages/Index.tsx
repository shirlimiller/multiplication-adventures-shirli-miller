import { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ProfileSelectionScreen } from '@/components/game/ProfileSelectionScreen';
import { PetCareHome } from '@/components/game/PetCareHome';
import { SetupScreen, GameMode } from '@/components/game/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { SummaryScreen } from '@/components/game/SummaryScreen';
import { BossChallenge } from '@/components/game/BossChallenge';
import { BalloonGame } from '@/components/game/BalloonGame';
import { BackButton } from '@/components/game/BackButton';
import { 
  GameState, 
  INITIAL_STATE, 
  AnsweredQuestion,
  generateAdaptiveQuestion,
  generateQuestionForOperation,
  Operation,
} from '@/lib/gameUtils';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { ShopItem, WalkLocation } from '@/lib/petTypes';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';
import { usePetState } from '@/hooks/usePetState';

type Screen = 'welcome' | 'profiles' | 'home' | 'setup' | 'game' | 'summary' | 'boss' | 'balloon';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentStats, setCurrentStats] = useState<PlayerStats | null>(null);
  const [bossTable, setBossTable] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('training');
  
  const { 
    players, 
    isLoaded, 
    addPlayer, 
    deletePlayer, 
    resetPlayerHistory,
    getPlayerStats,
    updatePlayerStats,
    spendStars,
  } = usePlayerStorage();

  const {
    currentHunger,
    currentHappiness,
    isDoubleStarsActive,
    feedPet,
    walkPet,
    interactWithPet,
    depleteHungerWhilePlaying,
  } = usePetState(selectedPlayer?.id || null);

  useEffect(() => {
    if (selectedPlayer) {
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
  }, [selectedPlayer, getPlayerStats]);

  const handleStart = () => setCurrentScreen('profiles');

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentStats(getPlayerStats(player.id));
    setCurrentScreen('home');
  };

  const handleBackToProfiles = () => {
    setSelectedPlayer(null);
    setCurrentStats(null);
    setCurrentScreen('profiles');
  };

  const handleStartSetup = () => setCurrentScreen('setup');

  const handleStartGame = useCallback((config: {
    operation: Operation;
    selectedNumbers: number[];
    rangeMin: number;
    rangeMax: number;
    questionCount: number;
    mode: GameMode;
  }) => {
    if (!selectedPlayer) return;
    
    setGameMode(config.mode);
    
    // Balloon mode goes to a different screen
    if (config.mode === 'balloon') {
      setGameState(prev => ({
        ...prev,
        selectedTables: config.selectedNumbers,
        operation: config.operation,
        rangeMin: config.rangeMin,
        rangeMax: config.rangeMax,
      }));
      setCurrentScreen('balloon');
      return;
    }
    
    const playerStats = getPlayerStats(selectedPlayer.id);
    const result =
      config.operation === 'multiply'
        ? { ...generateAdaptiveQuestion(config.selectedNumbers, playerStats, [], config.rangeMin, config.rangeMax), actualOperation: 'multiply' as Operation }
        : generateQuestionForOperation({
            operation: config.operation,
            selectedNumbers: config.selectedNumbers,
            rangeMin: config.rangeMin,
            rangeMax: config.rangeMax,
          });
    
    setGameState({
      ...INITIAL_STATE,
      currentScreen: 'game',
      selectedTables: config.selectedNumbers,
      operation: config.operation,
      currentQuestionOperation: result.actualOperation,
      rangeMin: config.rangeMin,
      rangeMax: config.rangeMax,
      questionCount: config.questionCount,
      currentMultiplier: result.multiplier,
      currentMultiplicand: result.multiplicand,
      correctAnswer: result.answer,
      questionStartTime: Date.now(),
      hintUsedInCurrentQuestion: false,
    });
    setCurrentScreen('game');
  }, [selectedPlayer, getPlayerStats]);

  const handleAnswer = useCallback((answer: number, isCorrect: boolean, responseTimeMs: number, starsEarned: number) => {
    // Apply double stars if active
    const finalStars = isDoubleStarsActive ? starsEarned * 2 : starsEarned;
    
    const newQuestion: AnsweredQuestion = {
      multiplier: gameState.currentMultiplier,
      multiplicand: gameState.currentMultiplicand,
      correctAnswer: gameState.correctAnswer,
      userAnswer: answer,
      isCorrect,
      responseTimeMs,
      starsEarned: finalStars,
      operation: gameState.currentQuestionOperation,
    };

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showFeedback: true,
      isCorrect,
      score: isCorrect ? prev.score + 10 : prev.score,
      stars: prev.stars + finalStars,
      streak: isCorrect ? prev.streak + 1 : 0,
      answeredQuestions: [...prev.answeredQuestions, newQuestion],
      mistakeCount: isCorrect ? prev.mistakeCount : prev.mistakeCount + 1,
    }));
  }, [gameState, isDoubleStarsActive]);

  const handleContinue = useCallback(() => {
    const nextQuestion = gameState.currentQuestion + 1;
    
    if (nextQuestion >= gameState.questionCount) {
      if (selectedPlayer) {
        const totalStars = gameState.answeredQuestions.reduce((sum, q) => sum + q.starsEarned, 0);
        updatePlayerStats(selectedPlayer.id, gameState.answeredQuestions, gameState.selectedTables, totalStars, gameState.operation);
        setCurrentStats(getPlayerStats(selectedPlayer.id));
      }
      setCurrentScreen('summary');
    } else {
      const playerStats = selectedPlayer ? getPlayerStats(selectedPlayer.id) : null;
      const result = playerStats
        ? (gameState.operation === 'multiply'
            ? { ...generateAdaptiveQuestion(gameState.selectedTables, playerStats, gameState.answeredQuestions, gameState.rangeMin, gameState.rangeMax), actualOperation: 'multiply' as Operation }
            : generateQuestionForOperation({
                operation: gameState.operation,
                selectedNumbers: gameState.selectedTables,
                rangeMin: gameState.rangeMin,
                rangeMax: gameState.rangeMax,
              }))
        : generateQuestionForOperation({
            operation: gameState.operation,
            selectedNumbers: gameState.selectedTables,
            rangeMin: gameState.rangeMin,
            rangeMax: gameState.rangeMax,
          });
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        currentMultiplier: result.multiplier,
        currentMultiplicand: result.multiplicand,
        correctAnswer: result.answer,
        currentQuestionOperation: result.actualOperation,
        userAnswer: null,
        showFeedback: false,
        isCorrect: null,
        questionStartTime: Date.now(),
        hintUsedInCurrentQuestion: false,
      }));
    }
  }, [gameState, selectedPlayer, updatePlayerStats, getPlayerStats]);

  const handleHintUsed = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hintUsedInCurrentQuestion: true,
    }));
  }, []);

  const handleBossUnlock = useCallback(() => {
    if (gameState.operation === 'multiply' && gameState.currentMultiplier) {
      setBossTable(gameState.currentMultiplier);
      setCurrentScreen('boss');
    }
  }, [gameState.currentMultiplier]);

  const handleBossComplete = useCallback((success: boolean) => {
    if (selectedPlayer) setCurrentStats(getPlayerStats(selectedPlayer.id));
    setBossTable(null);
    setCurrentScreen('game');
  }, [selectedPlayer, getPlayerStats]);

  const handlePurchase = useCallback((item: ShopItem): boolean => {
    if (!selectedPlayer || !currentStats || currentStats.totalStars < item.price) return false;
    spendStars(selectedPlayer.id, item.price);
    feedPet(item);
    setCurrentStats(getPlayerStats(selectedPlayer.id));
    return true;
  }, [selectedPlayer, currentStats, spendStars, feedPet, getPlayerStats]);

  const handleSpendStars = useCallback((amount: number) => {
    if (selectedPlayer) {
      spendStars(selectedPlayer.id, amount);
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
  }, [selectedPlayer, spendStars, getPlayerStats]);

  const handlePlayAgain = () => setCurrentScreen('setup');
  const handleReturnToMenu = () => {
    if (selectedPlayer) setCurrentStats(getPlayerStats(selectedPlayer.id));
    setCurrentScreen('home');
  };

  const handleBackFromGame = useCallback(() => {
    if (selectedPlayer && gameState.answeredQuestions.length > 0) {
      const totalStars = gameState.answeredQuestions.reduce((sum, q) => sum + q.starsEarned, 0);
      updatePlayerStats(selectedPlayer.id, gameState.answeredQuestions, gameState.selectedTables, totalStars, gameState.operation);
      setCurrentStats(getPlayerStats(selectedPlayer.id));
    }
    setCurrentScreen('setup');
  }, [selectedPlayer, gameState.answeredQuestions, gameState.selectedTables, gameState.operation, updatePlayerStats, getPlayerStats]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-village-map flex items-center justify-center">
        <div className="text-2xl font-bold text-primary animate-pulse">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-village-map flex flex-col relative">
      {currentScreen === 'welcome' && <WelcomeScreen onStart={handleStart} />}

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

      {currentScreen === 'home' && selectedPlayer && currentStats && (
        <PetCareHome
          player={selectedPlayer}
          stats={currentStats}
          currentHunger={currentHunger}
          currentHappiness={currentHappiness}
          isDoubleStarsActive={isDoubleStarsActive}
          onStartGame={handleStartSetup}
          onStartBalloonGame={(config) => {
            setGameState(prev => ({
              ...prev,
              selectedTables: config.selectedNumbers,
              operation: config.operation,
              rangeMin: 1,
              rangeMax: 10,
            }));
            setGameMode('balloon');
            setCurrentScreen('balloon');
          }}
          onSwitchPlayer={handleBackToProfiles}
          onPurchase={handlePurchase}
          onSpendStars={handleSpendStars}
          onFeedPet={feedPet}
          onWalkPet={walkPet}
          onPetInteract={interactWithPet}
        />
      )}

      {currentScreen === 'setup' && selectedPlayer && currentStats && (
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <BackButton onClick={handleReturnToMenu} />
          </div>
          <SetupScreen onStartGame={handleStartGame} playerStats={currentStats} />
        </div>
      )}

      {currentScreen === 'game' && selectedPlayer && currentStats && (
        <div className="relative flex-1 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <BackButton onClick={handleBackFromGame} />
          </div>
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
            gameMode={gameMode}
            operation={gameState.currentQuestionOperation}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            onBossUnlock={handleBossUnlock}
            showFeedback={gameState.showFeedback}
            isCorrect={gameState.isCorrect}
            questionStartTime={gameState.questionStartTime}
            hintUsedInCurrentQuestion={gameState.hintUsedInCurrentQuestion}
            onHintUsed={handleHintUsed}
          />
        </div>
      )}

      {currentScreen === 'boss' && bossTable && (
        <BossChallenge table={bossTable} onComplete={handleBossComplete} onExit={() => setCurrentScreen('game')} />
      )}

      {currentScreen === 'balloon' && selectedPlayer && currentStats && (
        <BalloonGame
          selectedNumbers={gameState.selectedTables}
          operation={gameState.operation}
          rangeMin={gameState.rangeMin}
          rangeMax={gameState.rangeMax}
          totalStars={currentStats.totalStars}
          highScore={currentStats.balloonHighScore ?? 0}
          isDoubleStarsActive={isDoubleStarsActive}
          onGameEnd={(results) => {
            // Award stars and update high score
            if (results.totalStars > 0 || results.correctAnswers > (currentStats.balloonHighScore ?? 0)) {
              const stats = getPlayerStats(selectedPlayer.id);
              const newHighScore = Math.max(stats.balloonHighScore ?? 0, results.correctAnswers);
              updatePlayerStats(selectedPlayer.id, [], gameState.selectedTables, results.totalStars, gameState.operation);
              // Save high score directly
              const updatedStats = getPlayerStats(selectedPlayer.id);
              updatedStats.balloonHighScore = newHighScore;
              // Persist via localStorage
              const storageKey = `math_game_stats_${selectedPlayer.id}`;
              localStorage.setItem(storageKey, JSON.stringify(updatedStats));
              setCurrentStats({ ...updatedStats });
            }
            setCurrentScreen('home');
          }}
          onBack={() => {
            if (selectedPlayer) setCurrentStats(getPlayerStats(selectedPlayer.id));
            setCurrentScreen('home');
          }}
        />
      )}

      {currentScreen === 'summary' && selectedPlayer && (
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <BackButton onClick={handleReturnToMenu} />
          </div>
          <SummaryScreen
            score={gameState.score}
            stars={gameState.stars}
            answeredQuestions={gameState.answeredQuestions}
            selectedTables={gameState.selectedTables}
            operation={gameState.operation}
            onPlayAgain={handlePlayAgain}
            onChangeSettings={handleReturnToMenu}
            playerStats={getPlayerStats(selectedPlayer.id)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
