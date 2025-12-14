import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group font-heading tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_10px_rgba(255,0,0,0.3)]",
        outline:
          "border border-primary/50 text-primary bg-transparent hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_10px_rgba(191,0,255,0.3)]",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        cyber:
          "bg-black border border-primary text-primary hover:bg-primary hover:text-black uppercase tracking-widest clip-path-polygon shadow-[0_0_5px_theme('colors.primary.DEFAULT')] hover:shadow-[0_0_15px_theme('colors.primary.DEFAULT')]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {props.children}
        </span>
        {variant === "cyber" && (
          <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
