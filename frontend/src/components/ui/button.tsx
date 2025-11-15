import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
    "button-styles",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary-hover active:bg-primary-pressed active:ring-4 active:ring-primary/10 transition-shadow duration-100 disabled:bg-primary-disabled disabled:text-background/50",
        secondary:
          "bg-secondary text-text hover:bg-secondary-hover active:bg-secondary-pressed disabled:bg-secondary-disabled disabled:text-text/50 active:ring-4 active:ring-primary/10 transition-shadow duration-100",
        link: "text-primary underline-offset-2 hover:underline hover:text-primary-hover active:text-primary-pressed disabled:text-primary-disabled",
      },
      size: {
        default: "h-[50px] px-5 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
