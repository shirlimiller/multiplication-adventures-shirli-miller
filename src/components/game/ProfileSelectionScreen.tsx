import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { Plus, Edit2, Trash2, X, RotateCcw } from 'lucide-react';
import { AddPlayerDialog } from './AddPlayerDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface ProfileSelectionScreenProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  onResetHistory: (playerId: string) => void;
  getPlayerStats: (playerId: string) => PlayerStats;
}

export function ProfileSelectionScreen({
  players,
  onSelectPlayer,
  onAddPlayer,
  onDeletePlayer,
  onResetHistory,
  getPlayerStats,
}: ProfileSelectionScreenProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);
  const [resetConfirm, setResetConfirm] = useState<Player | null>(null);

  const handlePlayerClick = (player: Player) => {
    if (isEditMode) return;
    onSelectPlayer(player);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gradient">
            הרפתקת לוח הכפל
          </h1>
          <p className="text-xl text-muted-foreground">מי משחק היום? 🎮</p>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player) => {
            const stats = getPlayerStats(player.id);
            return (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className={`
                  relative bg-card rounded-3xl p-6 shadow-card text-center transition-all duration-200
                  ${isEditMode ? 'cursor-default' : 'cursor-pointer hover:scale-105 hover:shadow-glow'}
                `}
              >
                {/* Avatar */}
                <div className="text-6xl mb-3">{player.avatar}</div>
                
                {/* Name */}
                <h3 className="text-xl font-bold text-foreground mb-2">{player.name}</h3>
                
                {/* Stats preview */}
                <div className="flex justify-center gap-3 text-sm text-muted-foreground">
                  <span>⭐ {stats.totalStars}</span>
                  <span>🏆 {stats.conqueredTables.length}</span>
                </div>

                {/* Edit mode actions */}
                {isEditMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button
                      onClick={() => setResetConfirm(player)}
                      className="bg-secondary hover:bg-secondary/80 text-white rounded-full p-2 shadow-md transition-colors"
                      title="אפס היסטוריה"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(player)}
                      className="bg-destructive hover:bg-destructive/80 text-white rounded-full p-2 shadow-md transition-colors"
                      title="מחק שחקן"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Player Card */}
          <div
            onClick={() => setShowAddDialog(true)}
            className="bg-card/50 border-4 border-dashed border-muted-foreground/30 rounded-3xl p-6 
                       flex flex-col items-center justify-center cursor-pointer
                       hover:border-primary hover:bg-card/80 transition-all duration-200 min-h-[180px]"
          >
            <Plus className="w-12 h-12 text-muted-foreground mb-2" />
            <span className="text-lg font-medium text-muted-foreground">הוסף שחקן</span>
          </div>
        </div>

        {/* Edit Mode Toggle */}
        <div className="flex justify-center">
          <Button
            variant={isEditMode ? 'destructive' : 'outline'}
            size="lg"
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center gap-2"
          >
            {isEditMode ? (
              <>
                <X className="w-5 h-5" />
                סיום עריכה
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                ערוך שחקנים
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add Player Dialog */}
      <AddPlayerDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={onAddPlayer}
        existingNames={players.map(p => p.name)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            onDeletePlayer(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
        title="מחיקת שחקן"
        message={`האם את/ה בטוח/ה שרוצה למחוק את ${deleteConfirm?.name}? כל ההיסטוריה וההתקדמות יימחקו לצמיתות!`}
        confirmText="כן, מחק"
        cancelText="ביטול"
        variant="destructive"
      />

      {/* Reset History Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!resetConfirm}
        onClose={() => setResetConfirm(null)}
        onConfirm={() => {
          if (resetConfirm) {
            onResetHistory(resetConfirm.id);
            setResetConfirm(null);
          }
        }}
        title="איפוס היסטוריה"
        message={`האם את/ה בטוח/ה שרוצה לאפס את כל ההיסטוריה של ${resetConfirm?.name}? כל הכוכבים, העולמות שנכבשו וההתקדמות יאופסו.`}
        confirmText="כן, אפס"
        cancelText="ביטול"
        variant="secondary"
      />
    </div>
  );
}
