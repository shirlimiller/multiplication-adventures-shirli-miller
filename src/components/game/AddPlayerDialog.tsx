import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Player, AVATARS, createPlayer } from '@/lib/playerTypes';
import { X } from 'lucide-react';

interface AddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: Player) => void;
  existingNames: string[];
}

export function AddPlayerDialog({ isOpen, onClose, onAdd, existingNames }: AddPlayerDialogProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('נא להזין שם');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('השם קצר מדי');
      return;
    }
    
    if (existingNames.some(n => n.toLowerCase() === trimmedName.toLowerCase())) {
      setError('שם זה כבר קיים');
      return;
    }

    const player = createPlayer(trimmedName, selectedAvatar);
    onAdd(player);
    
    // Reset form
    setName('');
    setSelectedAvatar(AVATARS[0]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedAvatar(AVATARS[0]);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-card animate-pop">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">שחקן חדש 🎉</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Name Input */}
        <div className="space-y-2 mb-6">
          <label className="text-lg font-medium">מה השם שלך?</label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="הכנס שם..."
            className="text-lg h-14 text-center"
            maxLength={20}
            autoFocus
          />
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
        </div>

        {/* Avatar Selection */}
        <div className="space-y-2 mb-8">
          <label className="text-lg font-medium">בחר דמות</label>
          <div className="grid grid-cols-8 gap-2">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`
                  text-3xl p-2 rounded-xl transition-all duration-200
                  ${selectedAvatar === avatar 
                    ? 'bg-primary scale-110 shadow-glow' 
                    : 'bg-muted hover:bg-muted/80 hover:scale-105'}
                `}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-muted rounded-2xl p-4 mb-6 text-center">
          <div className="text-5xl mb-2">{selectedAvatar}</div>
          <div className="text-lg font-bold">{name || 'השם שלך'}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleClose}
            className="flex-1"
          >
            ביטול
          </Button>
          <Button
            variant="game"
            size="lg"
            onClick={handleSubmit}
            className="flex-1"
          >
            צור שחקן! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
