// components/DemoCard.js
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PropertyProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export default function ProprertyCard({ title, description, buttonText, link }: PropertyProps)
 {
  return (
    <Card className="flex flex-col justify-between h-[250px] w-72 shadow-md rounded-xl p-6 bg-white text-[#123B4D]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base items-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-2">
            {/* Tu peux ajouter des champs supplémentaires ici */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-auto flex justify-start items-center overflow-hidden">
    	<Link href={link}>
        <Button className="bg-[hsl(27,96%,61%)] min-w-max w-auto text-white py-2 px-4 rounded-xl hover:bg-[#e76600] whitespace-nowrap">
        {buttonText}
		</Button>
		</Link>
      </CardFooter>
    </Card>
  );
}
