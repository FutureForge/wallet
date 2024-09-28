import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useState,
} from 'react'
import {
  Root,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Icon as SelectIcon,
  Portal as SelectPortal,
  Content as SelectContent,
  Viewport as SelectViewport,
  Item as SelectItem,
  ItemText as SelectItemText,
  ItemIndicator as SelectItemIndicator,
  ScrollUpButton,
  ScrollDownButton,
} from '@radix-ui/react-select'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

import { Button } from '../button'
import { cn } from '../../utils'

/* ----------------------------------------------------------------------------
 * Trigger
 * --------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof SelectTrigger>
type ButtonProps = ComponentProps<typeof Button>
type TriggerProps = ComponentPropsWithoutRef<typeof SelectTrigger> & {
  placeholder?: string
  variant?: ButtonProps['variant']
  disabled?: boolean
  btnClass?: string
}

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const {
    placeholder,
    className,
    variant = 'secondary',
    disabled = false,
    btnClass,
    ...triggerProps
  } = props

  return (
    <SelectTrigger
      className={cn(
        "py-[.625rem] px-2.5 flex justify-between font-inter w-full text-foreground items-center gap-1 outline-none whitespace-nowrap [&[data-state=open]_svg]:rotate-180 [&_svg]:shrink-0 transition-all duration-300 ease-in-out",
        className
      )}
      {...triggerProps}
      ref={ref}
      asChild
    >
      <button
        className={cn(
          "text-sm bg-transparent border border-dialog-border h-[45px] px-4 rounded-xl w-full",
          btnClass
        )}
      >
        <SelectValue placeholder={placeholder} />
        <SelectIcon>
          <ChevronDownIcon />
        </SelectIcon>
      </button>
    </SelectTrigger>
  );
})

Trigger.displayName = 'SelectTrigger'

/* ----------------------------------------------------------------------------
 * Content
 * --------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof SelectContent>
type ContentProps = ComponentPropsWithoutRef<typeof SelectContent>

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { children, sideOffset = 8, position = 'popper', className, ...contentProps } = props

  return (
    <SelectPortal>
      <SelectContent
        position={position}
        sideOffset={sideOffset}
        align="end"
        className={cn(
          "bg-background text-foreground px-2 rounded-[.9375rem] border border-dialog-border w-full flex items-center gap-8",
          className
        )}
        {...contentProps}
        ref={ref}
      >
        <ScrollUpButton className="h-6 flex justify-center items-center">
          <ChevronUpIcon />
        </ScrollUpButton>
        <SelectViewport className="p-2 px-0 relative space-y-2.5 min-w-[--radix-select-trigger-width] w-full">
          {children}
        </SelectViewport>
        <ScrollDownButton className="h-6 flex justify-center items-center">
          <ChevronDownIcon />
        </ScrollDownButton>
      </SelectContent>
    </SelectPortal>
  );
})

Content.displayName = 'SelectContent'

/* ----------------------------------------------------------------------------
 * Item
 * --------------------------------------------------------------------------*/

type ItemElement = ElementRef<typeof SelectItem>
type ItemProps = ComponentPropsWithoutRef<typeof SelectItem>

const Item = forwardRef<ItemElement, ItemProps>((props, ref) => {
  const { children, className, ...itemProps } = props
  return (
    <SelectItem
      className={cn(
        "outline-none flex text-muted-foreground hover:text-foreground hover:bg-primary transition-all duration-300 ease-in-out border hover:border-dialog-border border-transparent rounded-lg px-2.5 py-1.5 items-center w-full font-graphik justify-between cursor-pointer",
        className
      )}
      {...itemProps}
      ref={ref}
    >
      <SelectItemText className="flex gap-2">{children}</SelectItemText>
      <SelectItemIndicator>
        <CheckIcon />
      </SelectItemIndicator>
    </SelectItem>
  );
})

Item.displayName = 'SelectItem'
/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/

export const Select = {
  Root,
  Trigger,
  Content,
  Item,
}
