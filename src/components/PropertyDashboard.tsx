// components/OwnerDashboard.tsx
import React from "react";
import Carddashboard from "@/components/demos/ui/carddashboard";
import Link from "next/link";

export default function PropertyDashboard() {
  const cards = [
    {
      title: "Property Info",
      description: "Review and edit the details of your property.",
      buttonText: "Go to property",
	  link:'dashboardproperty/Propertyinfo',
    },
    {
      title: "Card Info",
      description: "Create and manage your card information for your property.",
      buttonText: "View card",
	  link:'dashboardproperty/Cardinfo',
    },
    {
      title: "Shop",
      description: "View and manage your shop. update your shop information.",
      buttonText: "View Shop",
	  link:'dashboardproperty/Shop_management',
    },
    {
      title: "Manage Acess",
      description: "Manage access to your property. Create and manage access code.",
      buttonText: "Manage",
	  link:'dashboardproperty/Manage_acess',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      {cards.map((card, index) => (
        <div key={index} className="p-4">
		 <Link href={card.link}>
          <Carddashboard
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
			link={card.link}
          />
		  </Link>
        </div>
      ))}
    </div>
  );
}
