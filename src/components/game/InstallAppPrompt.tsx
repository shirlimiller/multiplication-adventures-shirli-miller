import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export function InstallAppPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show every time the user enters the site
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        dir="rtl"
        className="max-w-md rounded-[2rem] border-4 border-primary/30 bg-gradient-to-b from-card to-background p-6 shadow-card"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <Smartphone className="w-9 h-9 text-primary-foreground" />
          </div>

          <h2 className="text-2xl font-extrabold text-gradient">
            פתחי את הרפתקאות לוח הכפל כמו אפליקציה
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            אפשר להוסיף את הרפתקאות לוח הכפל למסך הבית ולפתוח אותה בלחיצה אחת – בדיוק כמו אפליקציה רגילה.
          </p>

          <div className="w-full rounded-2xl bg-muted/60 border-2 border-border p-4 text-right space-y-3">
            <div>
              <div className="font-bold text-foreground mb-1">באייפון (Safari) 🍎</div>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1️⃣ לחצי על כפתור השיתוף בדפדפן</li>
                <li>2️⃣ בחרי "הוסף למסך הבית"</li>
                <li>3️⃣ אשרי ✅</li>
              </ol>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">באנדרואיד (Chrome) 🤖</div>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1️⃣ לחצי על שלוש הנקודות בפינה העליונה</li>
                <li>2️⃣ בחרי "הוספה למסך הבית"</li>
                <li>3️⃣ אשרי ✅</li>
              </ol>
            </div>
          </div>

          <Button
            variant="game"
            size="lg"
            onClick={() => setOpen(false)}
            className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-white border-0"
          >
            הבנתי ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
