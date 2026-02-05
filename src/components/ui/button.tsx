import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-wood text-foreground hover:brightness-105 shadow-wood border-2 border-[hsl(35_30%_60%)]",
        destructive: "bg-wood text-destructive hover:brightness-105 shadow-wood border-2 border-[hsl(15_50%_60%)]",
        outline: "border-[3px] border-[hsl(35_40%_70%)] bg-wood hover:bg-[hsl(35_45%_80%)] text-foreground shadow-wood",
        secondary: "bg-wood text-secondary-foreground hover:brightness-105 shadow-wood border-[3px] border-[hsl(340_50%_70%)]",
        ghost: "hover:bg-muted/50 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-wood text-success-foreground hover:brightness-105 shadow-wood border-[3px] border-[hsl(145_45%_55%)]",
        accent: "bg-wood text-accent-foreground hover:brightness-105 shadow-wood border-[3px] border-[hsl(45_70%_65%)]",
        game: "bg-wood text-white hover:brightness-105 shadow-wood border-[3px] border-[hsl(145_40%_55%)] transform hover:scale-105",
        world: "bg-wood text-foreground border-[3px] border-[hsl(35_30%_60%)] hover:scale-105 shadow-wood",
        answer: "bg-wood text-foreground border-[3px] border-[hsl(35_30%_60%)] hover:border-primary hover:scale-105 shadow-wood min-h-16",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-full",
        sm: "h-10 rounded-full px-4 text-base",
        lg: "h-14 rounded-full px-8 text-xl",
        xl: "h-16 rounded-full px-10 text-2xl",
        icon: "h-12 w-12 rounded-full",
        game: "h-20 px-10 text-2xl rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
