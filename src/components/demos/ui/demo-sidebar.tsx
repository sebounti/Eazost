"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { clx } from "@/lib/utils/clx/clx-merge";
import { cn } from "@/lib/utils/core/cn";
import ArrowLeft from "@/components/icons/arrow-left";
import SettingsIcon from "@/components/icons/settings";
import Terminal from "@/components/icons/terminal";
import UserPlus from "@/components/icons/user-plus";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export default function DemoSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-secondary/70 w-full flex-1 max-w-8xl mx-auto border overflow-hidden",
        "h-screen w-full", // pour votre cas, utilisez `h-screen` au lieu de `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            {open ? <SidebarLogo /> : <SidebarLogoIcon />}
            <div className="flex flex-col gap-2 mt-8">
              {LINKS_ITEMS.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Ever UI",
                href: "#",
                icon: (
                  <Image
                    src="public/logo.png"
                    className="flex-shrink-0 rounded-full size-7"
                    width={50}
                    height={50}
                    alt="Logo"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Demo_Dashboard />
    </div>
  );
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

function Demo_Dashboard() {
  const Dashboard = clx.div("flex flex-1");
  const DashboardHeader = clx.div("flex gap-2");
  const DashboardCell = clx.div("size-full rounded-lg bg-secondary animate-pulse");
  const DashboardBody = clx.div("flex flex-1 gap-2");
  const DashboardContainer = clx.div(
    "flex flex-col flex-1 size-full gap-2 p-2 bg-card border md:p-10 rounded-tl-2xl",
  );

  return (
    <Dashboard>
      <DashboardContainer>
        <DashboardHeader>
          {[...new Array(4)].map((i) => (
            <DashboardCell key={`first-array${i}`} className="h-20" />
          ))}
        </DashboardHeader>
        <DashboardBody>
          {[...new Array(2)].map((i) => (
            <DashboardCell key={`second-array${i}`} />
          ))}
        </DashboardBody>
      </DashboardContainer>
    </Dashboard>
  );
}

const SidebarLogo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center py-1 space-x-2 text-sm font-normal text-black"
    >
      <div className="flex-shrink-0 w-6 h-5 bg-black rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre dark:text-white"
      >
      </motion.span>
    </Link>
  );
};
const SidebarLogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center py-1 space-x-2 text-sm font-normal text-black"
    >
      <div className="flex-shrink-0 w-6 h-5 bg-black rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg dark:bg-white" />
    </Link>
  );
};

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                        CONSTANTS                           */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const LINKS_ITEMS = [
  {
    label: "Dashboard",
    href: "#",
    icon: <Terminal className="flex-shrink-0 size-5 text-primary" />,
  },
  {
    label: "Profile",
    href: "#",
    icon: <UserPlus className="flex-shrink-0 size-5 text-primary" />,
  },
  {
    label: "Settings",
    href: "#",
    icon: <SettingsIcon className="flex-shrink-0 size-5 text-primary" />,
  },
  {
    label: "Logout",
    href: "#",
    icon: <ArrowLeft className="flex-shrink-0 size-5 text-primary" />,
  },
];
