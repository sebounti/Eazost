// components/OwnerDashboard.tsx
import React from "react";
import Carddashboard from "@/components/demos/ui/carddashboard";
import Link from "next/link";

export default function OwnerDashboard() {
  const cards = [
    {
      title: "My Property",
      description: "Manage your property service, generate code, interact with clients, and stay updated with the latest.",
      buttonText: "Go to property",
	  link:'owner/property',
    },
    {
      title: "Generate Code Access",
      description: "Generate code access for your property and share it with your clients.",
      buttonText: "Generate",
	  link:'/owner/generatecode',
    },
    {
      title: "Messages",
      description: "Communicate with your clients and stay updated with the latest.",
      buttonText: "View messages",
	  link:'owner/messages',
    },
    {
      title: "Profile",
      description: "Administer your profile and settings.",
      buttonText: "Manage profile",
	  link:'/owner/profile',
    },
    {
      title: "Managements",
      description: "Manage Api and settings.",
      buttonText: "Manage",
	  link:'/owner/management',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center ">
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
