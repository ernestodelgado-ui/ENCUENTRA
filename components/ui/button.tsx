import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 min-h-11 px-6 text-[15px]",
  {
    variants: {
      variant: {
        primary: "bg-coral text-white hover:bg-coral-dark active:bg-coral-dark",
        secondary:
          "bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/90",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-black/[0.03]",
        ghost: "bg-transparent text-foreground hover:bg-black/[0.03]",
      },
      size: {
        default: "min-h-11 px-6 py-2.5",
        sm: "min-h-9 px-4 py-2 text-sm",
        lg: "min-h-13 px-7 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        {...rest}
      />
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
