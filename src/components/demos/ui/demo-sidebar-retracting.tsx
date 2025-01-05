"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import ChevronRight from "@/components/icons/chevron-right";
import FileQuestion from "@/components/icons/file-question";

// TODO UI.

export default function DemoSidebarRetracting() {
  const [open, setOpen] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("Dashboard");

  return (
    <div className="flex gap-4 w-full h-full">
      <motion.nav
        layout
        className="sticky top-0 h-[600px] shrink-0 border-r border-input bg-accent p-2"
        style={{
          width: open ? "w-[225px]" : "fit-content",
        }}
      >
        <TitleSection open={open} />

        <div className="space-y-1">
          <Option
            Icon={FileQuestion}
            title="Dashboard"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileQuestion}
            title="Sales"
            selected={selected}
            setSelected={setSelected}
            open={open}
            notifs={3}
          />
          <Option
            Icon={FileQuestion}
            title="View Site"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileQuestion}
            title="Products"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileQuestion}
            title="Tags"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileQuestion}
            title="Analytics"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileQuestion}
            title="Members"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>

        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>

      <div className="w-full" />
    </div>
  );
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

type OptionProps = {
  Icon: React.ElementType;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: OptionProps) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-neutral-500 text-indigo-800" : "text-muted-foreground hover:bg-accent"}`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-3 border-b border-input pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-accent">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">Company Name</span>
              <span className="block text-xs text-muted-foreground">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <ChevronRight className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
    />
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <motion.button
      layout
      // @ts-expect-error: TODO UI.
      onClick={() => setOpen((pv: boolean) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-input transition-colors hover:bg-accent"
    >
      <div className="flex items-center p-2">
        <motion.div layout className="grid size-10 place-content-center text-lg">
          <ChevronRight className={`transition-transform ${open && "rotate-180"}`} />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
