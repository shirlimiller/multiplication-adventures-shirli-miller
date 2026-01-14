import { EMOJIS } from '@/lib/gameUtils';

interface VisualExplanationProps {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
}

export function VisualExplanation({ multiplier, multiplicand, correctAnswer }: VisualExplanationProps) {
  const emoji = EMOJIS[multiplier % EMOJIS.length];
  
  // For 3×2: show 3 bags with 2 items each (multiplicand bags, multiplier items inside)
  // The first number (multiplicand) is how many groups
  // The second number (multiplier) is how many items per group
  const numberOfBags = multiplicand;
  const itemsPerBag = multiplier;
  
  const groups = Array.from({ length: numberOfBags }, (_, i) => i);
  
  return (
    <div className="space-y-4">
      <p className="text-xl font-medium text-center">
        התשובה הנכונה היא: <span className="text-3xl font-bold text-primary">{correctAnswer}</span>
      </p>
      
      <p className="text-lg text-muted-foreground text-center">
        {numberOfBags} שקיות, בכל אחת {itemsPerBag} פריטים:
      </p>
      
      <div className="flex flex-wrap justify-center gap-3">
        {groups.map((groupIndex) => (
          <div
            key={groupIndex}
            className="relative bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 rounded-2xl p-3 min-w-[80px] shadow-soft animate-pop"
            style={{ animationDelay: `${groupIndex * 100}ms` }}
          >
            {/* Bag/circle label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {groupIndex + 1}
            </div>
            
            {/* Items inside the bag */}
            <div className="flex flex-wrap justify-center gap-1 pt-1">
              {Array.from({ length: itemsPerBag }, (_, itemIndex) => (
                <span 
                  key={itemIndex} 
                  className="text-2xl"
                  style={{ animationDelay: `${(groupIndex * itemsPerBag + itemIndex) * 50}ms` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center space-y-2 mt-4">
        <p className="text-lg text-muted-foreground">
          {multiplicand} × {multiplier} = <span className="text-2xl font-bold text-primary">{correctAnswer}</span>
        </p>
      </div>
    </div>
  );
}
