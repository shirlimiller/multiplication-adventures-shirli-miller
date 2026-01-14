import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'destructive' | 'secondary';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'destructive',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-card animate-pop">
        {/* Warning Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
          ${variant === 'destructive' ? 'bg-destructive/20' : 'bg-secondary/20'}`}>
          <AlertTriangle className={`w-8 h-8 
            ${variant === 'destructive' ? 'text-destructive' : 'text-secondary'}`} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>

        {/* Message */}
        <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="lg"
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
