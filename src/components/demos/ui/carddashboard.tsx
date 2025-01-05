// components/DemoCard.js

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import '@/app/globals.css'; // Chemin vers votre fichier CSS global
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface DemoCardProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export default function DemoCard({ title, description, buttonText, link }: DemoCardProps)
 {
	console.log("Link passed to DemoCard: ", Link);
  return (
    <Card className="flex flex-col justify-between h-[280px] w-[400px] p-6 text-[#123B4D] rounded-xl">
      <CardHeader>
        <CardTitle className="text-xxl text-black mb-2 ">{title}</CardTitle>
        <CardDescription className="text-base items-center text-black">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-2">
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-auto flex justify-start items-center overflow-hidden">
    	<Link href={link}>
        <Button className="bg-[#F6C494] text-black font-bold rounded-xl min-w-max w-auto py-2 px-4 hover:bg-[#e76600] whitespace-nowrap  ">
        {buttonText}
		</Button>
		</Link>
      </CardFooter>
    </Card>
  );
}
