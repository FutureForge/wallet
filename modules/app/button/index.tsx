import { ComponentPropsWithoutRef, ElementRef, ReactNode, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps } from 'tailwind-variants';
import { button } from './button.styles';

type ButtonElement = ElementRef<'button'>;
type PrimitiveButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'>;
type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = {
  children: ReactNode;
  asChild?: boolean;
} & PrimitiveButtonProps &
  ButtonVariants;

const Button = forwardRef<ButtonElement, ButtonProps>((props, ref) => {
  const { className, variant = 'primary', size, asChild = false, ...buttonProps } = props;

  const Comp = asChild ? Slot : 'button';

  return <Comp className={button({ variant, size, className })} {...buttonProps} ref={ref} />;
});

Button.displayName = 'Button';

export { Button };
