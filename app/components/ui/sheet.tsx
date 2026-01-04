import { Dialog as BaseSheet } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "~/utils";

function Sheet<Payload>({
  ...props
}: React.ComponentProps<typeof BaseSheet.Root<Payload>>) {
  return <BaseSheet.Root<Payload> data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof BaseSheet.Trigger>) {
  return <BaseSheet.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof BaseSheet.Close>) {
  return <BaseSheet.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof BaseSheet.Portal>) {
  return <BaseSheet.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheet.Backdrop>) {
  return (
    <BaseSheet.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "absolute inset-0 bg-black/50 transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  withOverlay = true,
  ...props
}: React.ComponentProps<typeof BaseSheet.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  withOverlay?: boolean;
}) {
  return (
    <SheetPortal>
      {withOverlay && <SheetOverlay />}
      <BaseSheet.Viewport className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 py-24 sm:px-0 sm:py-48">
        <BaseSheet.Popup
          data-slot="sheet-content"
          className={cn(
            "flex max-h-full min-h-0 max-w-2xl flex-col rounded-lg bg-popover text-popover-foreground shadow-lg outline-hidden transition ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-closed:duration-200 data-open:duration-500",
            side === "right" &&
              "inset-y-0 right-0 size-full origin-right border",
            side === "left" && "inset-y-0 left-0 size-full origin-left border",
            side === "top" &&
              "inset-x-0 top-0 h-auto w-full origin-top border data-ending-style:-translate-y-full data-starting-style:-translate-y-full",
            side === "bottom" &&
              "inset-x-0 bottom-0 h-auto w-full origin-bottom border data-ending-style:translate-y-full data-starting-style:translate-y-full",
            className,
          )}
          {...props}
        >
          {children}
          <SheetClose className="absolute top-4 right-4 rounded-xs text-muted-foreground opacity-50 ring-offset-popover transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-[3px] focus:ring-ring focus:ring-offset-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </BaseSheet.Popup>
      </BaseSheet.Viewport>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheet.Title>) {
  return (
    <BaseSheet.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheet.Description>) {
  return (
    <BaseSheet.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
};
