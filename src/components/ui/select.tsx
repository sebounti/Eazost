"use client";

import * as React from "react";

import { clx } from "@/lib/utils/clx/clx-merge";
import { cn } from "@/lib/utils/core/cn";
import Check from "@/components/icons/check";
import ChevronDown from "@/components/icons/chevron-down";
import ChevronUp from "@/components/icons/chevron-up";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as SelectPrimitive from "@/components/primitives/select";
import { MOTION, STYLES } from "@/components/ui/_shared";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectLabel = clx(SelectPrimitive.Label, "py-1.5 pl-8 pr-2 text-sm font-semibold");
const SelectSeparator = clx(SelectPrimitive.Separator, "-mx-1 my-1 h-px bg-muted");

const ScrollUpButtonRoot = clx(
  SelectPrimitive.ScrollUpButton,
  STYLES.FLEX_CENTER_JUSTIFIED,
  STYLES.CURSOR_DEFAULT,
  "py-1",
);
const ScrollDownButtonRoot = clx(
  SelectPrimitive.ScrollUpButton,
  STYLES.FLEX_CENTER_JUSTIFIED,
  STYLES.CURSOR_DEFAULT,
  "py-1",
);

const TriggerWrapper = clx(
  SelectPrimitive.Trigger,
  STYLES.OFFSET_BG,
  STYLES.RING_FOCUS,
  STYLES.DISABLED_NOT_ALLOWED,
  STYLES.FLEX_BETWEEN,
  STYLES.BORDER_INPUT,
  STYLES.TEXT_MUTED_PLACEHOLDER,
  "h-10 w-full rounded-md bg-white !important px-3 py-2 text-sm  [&>span]:line-clamp-1",
);

const SelectContentRoot = clx(
  SelectPrimitive.Content,
  MOTION.ANIMATE_IN,
  MOTION.ANIMATE_OUT,
  MOTION.FADE_IN_OUT,
  MOTION.ZOOM_IN_OUT,
  MOTION.SLIDE_IN,
  STYLES.CONTENT_OVERFLOW_POPOVER,
  "relative max-h-96 min-w-[8rem] shadow-md p-1",
);

const _SelectItemRoot = clx(
  SelectPrimitive.Item,
  STYLES.DISABLED_EVENTS_NONE_DATA,
  STYLES.CURSOR_DEFAULT,
  STYLES.FLEX_CENTER,
  "focus:bg-accent focus:text-accent-foreground",
  "relative w-full select-none rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
);

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <TriggerWrapper ref={ref} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </TriggerWrapper>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

function SelectScrollUpButton({
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <ScrollUpButtonRoot {...props}>
      <ChevronUp className="size-4" />
    </ScrollUpButtonRoot>
  );
}

function SelectScrollDownButton({
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <ScrollDownButtonRoot {...props}>
      <ChevronUp className="size-4" />
    </ScrollDownButtonRoot>
  );
}

function SelectContent({
  children,
  position = "popper",
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectContentRoot
        className={cn(
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectContentRoot>
    </SelectPrimitive.Portal>
  );
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
