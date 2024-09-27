import { tv } from 'tailwind-variants';

export const button = tv(
  {
    base: 'cursor-pointer flex gap-1.5 justify-center items-center px-3 h-8 rounded-lg font-sans text-sm font-medium duration-300 ease-out disabled:cursor-default',
    variants: {
      variant: {
        primary:
          'bg-[linear-gradient(180deg,#6B59C8_0%,#523DBF_100%)] text-new-foreground hover:brightness-125 hover:opacity-100 hover:shadow-new-accent/25 disabled:opacity-25',
        secondary:
          'text-new-foreground bg-new-terciary border border-new-elements-border hover:brightness-125 hover:opacity-100 disabled:opacity-25',
        'flat-primary':
          'bg-new-accent text-new-foreground hover:brightness-125 hover:opacity-100 hover:shadow-new-accent/25 disabled:opacity-25',
        'flat-secondary':
          'bg-new-accent/10 text-new-accent disabled:opacity-25 disabled:bg-transparent',
        'nav-btn':
          'bg-new-terciary text-new-muted-foreground hover:brightness-125 hover:opacity-100 disabled:opacity-25',
        'approve-btn':
          'bg-new-warning/10 text-new-warning disabled:opacity-25 hover:brightness-125',
        destructive:
          'bg-gradient-to-t from-white/0 via-transparent to-white/[12%] bg-new-error border border-[white]/[12%] text-new-foreground hover:brightness-125 hover:opacity-100 disabled:opacity-25',
      },
      size: {
        ['sm']: 'h-9 px-4',
        ['md']: 'h-8 px-3',
        ['lg']: 'h-[30px] px-2',
        ['xl']: 'h-10 px-4',
        ['icon']: 'size-9 p-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
  { responsiveVariants: true },
);
