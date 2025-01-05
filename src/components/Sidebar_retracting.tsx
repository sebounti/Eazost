"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from '@/stores/authStore';

// icônes
import { FaRegUserCircle } from "react-icons/fa";
import { IoKeyOutline, IoHomeOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { RiShoppingBasketLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
// Supprimez l'ancienne fonction handleLogout et remplacez-la par celle-ci :
const handleLogout = () => {
  // Afficher le toast de confirmation
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <p className="text-gray-800 mb-4">Voulez-vous vraiment vous déconnecter ?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t)}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
        <button
          onClick={async() => {
            const logout = useAuthStore.getState().logout;
            try {
				await logout(); // Appelle la déconnexion via Zustand
				toast.success('Déconnexion réussie');
			  } catch (error) {
				console.error('Erreur lors de la déconnexion :', error);
				toast.error('Une erreur est survenue lors de la déconnexion.');
			  } finally {
				toast.dismiss(t);
			  }
			}}
          className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Confirmer
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
  });
};

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


  // Fonction pour gérer l'expansion des sections accordéon
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
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-3 space-x text-lg">
          <Option
            Icon={IoHomeOutline}
            title="Propriétés"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="/dashboard/property"
          />
		  <Option
            Icon={IoInformationCircleOutline}
            title="Carte info"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="/dashboard/infoCard"
          />
          <Option
            Icon={IoKeyOutline}
            title="Code d'accès"
            selected={selected}
            setSelected={setSelected}
            open={open}
            mainRoute="/dashboard/AccessCode" // Route pour l'option principale
          />
          <Option
            Icon={RiShoppingBasketLine}
            title="Boutique"
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
            title="Compte"
            selected={selected}
            setSelected={setSelected}
            selectedSubOption={selectedSubOption}
            setSelectedSubOption={setSelectedSubOption}
            open={open}
            expanded={expanded}
            setExpanded={handleExpand}
            subOptions={["Profil", "Paramètres"]}
            subOptionRoutes={["/dashboard/account/profile", "/dashboard/account/settings"]}
          />
          <Option
            Icon={BiLogOut}
            title="Déconnexion"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>
      </motion.nav>
    </div>
  );
}

// Props pour chaque option du menu
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


// Composant pour chaque option du menu
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


  // Fonction pour gérer les clics sur les options
  const handleClick = (e: React.MouseEvent) => {
    if (title === "Logout") {
      e.preventDefault(); // Empêcher la navigation par défaut
      handleLogout();
    } else {
      setSelected(title);
      if (setExpanded) setExpanded(title);
    }
  };

  return (
    <>
      {title === "Logout" ? (
        <motion.button
          layout
          onClick={handleClick}
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
      ) : (
        <Link href={mainRoute || "#"} passHref>
          <motion.button
            layout
            onClick={handleClick}
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
      )}

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
