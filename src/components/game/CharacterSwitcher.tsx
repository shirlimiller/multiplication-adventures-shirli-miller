import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CharacterId, CHARACTER_REGISTRY } from '@/lib/characterTypes';
import { cn } from '@/lib/utils';

interface CharacterSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharacter: CharacterId;
  onSelect: (id: CharacterId) => void;
}

export function CharacterSwitcher({ isOpen, onClose, currentCharacter, onSelect }: CharacterSwitcherProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" dir="rtl">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-violet-100 via-pink-50 to-amber-50 rounded-[28px] shadow-2xl overflow-hidden border-4 border-violet-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 p-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 drop-shadow-lg">
              🔄 בחר דמות
            </h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white/25 hover:bg-white/50 text-white p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/90 mt-1 drop-shadow">
            החלפת דמות היא חינם! הבגדים נשמרים 🎉
          </p>
        </div>

        {/* Character Grid */}
        <div className="p-5 space-y-3">
          {CHARACTER_REGISTRY.map((char) => {
            const isActive = char.id === currentCharacter;
            return (
              <button
                key={char.id}
                onClick={() => {
                  onSelect(char.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-[3px] transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-emerald-400 ring-2 ring-emerald-300 shadow-lg'
                    : 'bg-white border-violet-200 hover:border-pink-400 hover:bg-pink-50/50 shadow-sm hover:shadow-md'
                )}
              >
                <span className="text-5xl">{char.emoji}</span>
                <div className="flex-1 text-right">
                  <div className="font-extrabold text-lg text-foreground">{char.name}</div>
                  <div className="text-sm text-muted-foreground">{char.description}</div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1 bg-emerald-500 text-white rounded-full px-3 py-1">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-bold">נבחר</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <p className="text-center text-xs text-muted-foreground">
            ✨ כל הבגדים שלך יישארו על הדמות החדשה!
          </p>
        </div>
      </div>
    </div>
  );
}
