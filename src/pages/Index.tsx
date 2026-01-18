import { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ProfileSelectionScreen } from '@/components/game/ProfileSelectionScreen';
import { PetCareHome } from '@/components/game/PetCareHome';
import { SetupScreen, GameMode } from '@/components/game/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { SummaryScreen } from '@/components/game/SummaryScreen';
import { BossChallenge } from '@/components/game/BossChallenge';
import { BackButton } from '@/components/game/BackButton';
import { 
  GameState, 
  INITIAL_STATE, 
  AnsweredQuestion,
  generateAdaptiveQuestion,
} from '@/lib/gameUtils';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { ShopItem } from '@/lib/petTypes';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';
import { usePetState } from '@/hooks/usePetState';

type Screen = 'welcome' | 'profiles' | 'home' | 'setup' | 'game' | 'summary' | 'boss';

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
    isDoubleStarsActive,
    feedPet,
    interactWithPet,
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

  const handleStartGame = useCallback((tables: number[], questionCount: number, mode: GameMode) => {
    if (!selectedPlayer) return;
    
    setGameMode(mode);
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
        updatePlayerStats(selectedPlayer.id, gameState.answeredQuestions, gameState.selectedTables, totalStars);
        setCurrentStats(getPlayerStats(selectedPlayer.id));
      }
      setCurrentScreen('summary');
    } else {
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

  const handleBossUnlock = useCallback(() => {
    if (gameState.currentMultiplier) {
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-garden flex items-center justify-center">
        <div className="text-2xl font-bold text-primary animate-pulse">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          isDoubleStarsActive={isDoubleStarsActive}
          onStartGame={handleStartSetup}
          onSwitchPlayer={handleBackToProfiles}
          onPurchase={handlePurchase}
          onSpendStars={handleSpendStars}
          onFeedPet={feedPet}
          onPetInteract={interactWithPet}
        />
      )}

      {currentScreen === 'setup' && selectedPlayer && currentStats && (
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <BackButton onClick={handleReturnToMenu} />
          </div>
          <SetupScreen onStartGame={handleStartGame} conqueredTables={currentStats.conqueredTables} />
        </div>
      )}

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
          gameMode={gameMode}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
          onBossUnlock={handleBossUnlock}
          showFeedback={gameState.showFeedback}
          isCorrect={gameState.isCorrect}
          questionStartTime={gameState.questionStartTime}
        />
      )}

      {currentScreen === 'boss' && bossTable && (
        <BossChallenge table={bossTable} onComplete={handleBossComplete} onExit={() => setCurrentScreen('game')} />
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
