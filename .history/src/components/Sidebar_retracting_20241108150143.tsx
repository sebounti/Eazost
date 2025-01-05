"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// icônes
import { FaRegUserCircle } from "react-icons/fa";
import { IoKeyOutline, IoHomeOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { RiShoppingBasketLine } from "react-icons/ri";

export default function SidebarRetracting() {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null); // Gère l'expansion des sections accordéon

  // Gestion de l'ouverture/fermeture automatique en fonction de la position de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Ouvre le menu si la souris est à gauche de l'écran
      if (e.clientX < 100 && !open) {
        setOpen(true);
      }
      // Ferme le menu si la souris s'éloigne du côté gauche
      if (e.clientX > 300 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  // Réinitialiser la sélection lorsque le menu se ferme
  useEffect(() => {
    if (!open) {
      setSelected(null);
    }
  }, [open]);


  const handleExpand = (section: string) => {
    // Si la section cliquée est déjà ouverte, on la ferme, sinon on l'ouvre
    setExpanded(expanded === section ? null : section);
  };

  return (
    <div className="flex gap-4 mr-7 h-full">
      <motion.nav
        layout
        className={`sticky top-0 h-full shrink-0 bg-slate-50 transition-all duration-300 ${
          open ? "w-[230px]" : "w-[30px]"
        }`}
      >
        <div className="py-6 px-4">
          <div className="flex items-center gap-2">
            {open && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="font-bold text-3xl text-black"
              >
                EaZost
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-3 space-x text-lg">
          <Option
            Icon={IoHomeOutline}
            title="Property"
            selected={selected}
            setSelected={setSelected}
            selectedSubOption={selectedSubOption}
            setSelectedSubOption={setSelectedSubOption}
            open={open}
            expanded={expanded}
            setExpanded={handleExpand}
            subOptions={["List Property", "Add property"]}
            subOptionRoutes={["owner/dashboard/property/list", "/dashboard/property/add"]}
          />
          <Option
            Icon={IoKeyOutline}
            title="Access Code"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="/dashboard/property/AccessCode" // Route pour l'option principale
          />
          <Option
            Icon={RiShoppingBasketLine}
            title="Shop"
            selected={selected}
            setSelected={setSelected}
            selectedSubOption={selectedSubOption}
            setSelectedSubOption={setSelectedSubOption}
            open={open}
            expanded={expanded}
            setExpanded={handleExpand}
            subOptions={["List-shop", "Checkout", "Manage"]}
            subOptionRoutes={["/dashboard/shop/list", "/dashboard/shop/checkout", "/dashboard/shop/add-product", "owner/dashboard/shop/edit-product"]}
          />
          <Option
            Icon={TiMessages}
            title="Messages"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="/dashboard/property/Messages" // Route pour l'option principale
          />
          <Option
            Icon={FaRegUserCircle}
            title="Account"
            selected={selected}
            setSelected={setSelected}
            selectedSubOption={selectedSubOption}
            setSelectedSubOption={setSelectedSubOption}
            open={open}
            expanded={expanded}
            setExpanded={handleExpand}
            subOptions={["Profile", "Settings"]}
            subOptionRoutes={["/dashboard/account/profile", "/dashboard/account/settings"]}
          />
          <Option
            Icon={BiLogOut}
            title="Logout"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="logout" // Route pour le logout
          />
        </div>
      </motion.nav>
    </div>
  );
}

type OptionProps = {
  Icon: React.ElementType;
  title: string;
  selected: string | null;
  setSelected: (title: string) => void;
  selectedSubOption?: string | null;
  setSelectedSubOption?: (subOption: string) => void;
  open: boolean;
  expanded?: string | null;
  setExpanded?: (section: string) => void;
  subOptions?: string[];
  subOptionRoutes?: string[];
  mainRoute?: string;
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  selectedSubOption,
  setSelectedSubOption,
  open,
  expanded,
  setExpanded,
  subOptions,
  subOptionRoutes,
  mainRoute,
}: OptionProps) => {
  const isExpanded = expanded === title;

  return (
    <>
      <Link href={mainRoute || "#"} passHref>
        <motion.button
          layout
          onClick={() => {
            setSelected(title);
            if (setExpanded) setExpanded(title); // Ouvre/ferme le sous-menu
          }}
          className={`relative flex h-10 w-full items-center px-4 rounded-md transition-colors text-xl ${
            selected === title
              ? "bg-amber-500 text-white shadow-md rounded-xl"
              : "text-gray-800 hover:bg-slate-100"
          }`}
        >
          <motion.div layout className="grid h-full w-10 place-content-center text-3xl">
            <Icon />
          </motion.div>
          {open && (
            <motion.span
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              className="ml-4 font-medium"
            >
              {title}
            </motion.span>
          )}
        </motion.button>
      </Link>

      {/* Sous-options (accordéon) */}
      {isExpanded && subOptions && open && (
        <motion.div
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="ml-12 mt-1 space-y-1"
        >
          {subOptions.map((subOption, index) => (
            <Link href={subOptionRoutes ? subOptionRoutes[index] : "#"} key={subOption}>
                <motion.button
                  layout
                  onClick={() => setSelectedSubOption && setSelectedSubOption(subOption)}
                  className={`block text-sm text-slate-600 hover:text-amber-500 md:text-lg ${
                    selectedSubOption === subOption ? "text-amber-400" : ""
                  }`}
                >
                  {subOption}
                </motion.button>
            </Link>
          ))}
        </motion.div>
      )}
    </>
  );
};
