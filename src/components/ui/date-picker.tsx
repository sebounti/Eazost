import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";


interface ShadcnDatePickerProps {
	startYear: number;
	endYear: number;
	selected?: Date;
	onSelect: (date: Date) => void;
	initialFocus?: boolean;
	placeholder?: string;
}

const monthsFR = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre",
  ];

export const ShadcnDatePicker: React.FC<ShadcnDatePickerProps> = ({
	startYear,
	endYear,
	selected,
	onSelect,
	initialFocus,
	placeholder,
}) => {
	const [error, setError] = useState<string | null>(null);
	const defaultDate = new Date();

	const handleDayChange = (day: string) => {
	  const newDate = new Date((selected || defaultDate).getFullYear(), (selected || defaultDate).getMonth(), parseInt(day));
	  if (isNaN(newDate.getTime())) {
		setError("Date invalide");
	  } else {
		setError(null);
		onSelect(newDate);
	  }
	};

	const handleMonthChange = (month: string) => {
	  const newDate = new Date((selected || defaultDate).getFullYear(), monthsFR.indexOf(month), (selected || defaultDate).getDate());
	  if (isNaN(newDate.getTime())) {
		setError("Date invalide");
	  } else {
		setError(null);
		onSelect(newDate);
	  }
	};

	const handleYearChange = (year: string) => {
	  const newDate = new Date(parseInt(year), (selected || defaultDate).getMonth(), (selected || defaultDate).getDate());
	  if (isNaN(newDate.getTime())) {
		setError("Date invalide");
	  } else {
		setError(null);
		onSelect(newDate);
	  }
	};

	return (
	  <div className="grid grid-cols-3 gap-4 max-w-[500px] dark:text-white">
		{/* Sélection du jour */}
		<Select onValueChange={handleDayChange}>
		  <SelectTrigger className="h-auto shadow-sm focus:outline-0 min-h-[40px] min-w-[30px]">
			<SelectValue
			  placeholder={
				<div>
				  <span className="text-muted-foreground pr-6 text-lg text-amber-600 font-semibold dark:text-white">Jours</span>
				  {selected?.getDate() || "-"}
				</div>
			  }
			/>
		  </SelectTrigger>
		  <SelectContent>
			<ScrollArea className="h-48 bg-slate-100">
			  {Array.from({ length: 31 }, (_, i) => (
				<SelectItem key={i + 1} value={(i + 1).toString()}>
				  {i + 1}
				</SelectItem>
			  ))}
			</ScrollArea>
		  </SelectContent>
		</Select>

		{/* Sélection du mois */}
		<Select onValueChange={handleMonthChange}>
		  <SelectTrigger className="h-auto shadow-sm focus:outline-0 min-w-[170px] pr-2">
			<SelectValue
			  placeholder={
				<div>
				  <span className="text-muted-foreground pr-4 dark:text-white text-lg text-amber-600 font-bold">Mois</span>
				  {monthsFR[selected?.getMonth() || 0] || "-"}
				</div>
			  }
			/>
		  </SelectTrigger>
		  <SelectContent>
			<ScrollArea className="h-48 bg-slate-100">
			  {monthsFR.map((month, index) => (
				<SelectItem key={index} value={month}>
				  {month}
				</SelectItem>
			  ))}
			</ScrollArea>
		  </SelectContent>
		</Select>

		{/* Sélection de l'année */}
		<Select onValueChange={handleYearChange}>
		  <SelectTrigger className="h-auto shadow-sm focus:outline-0 min-w-[130px]">
			<SelectValue
			  placeholder={
				<div>
				  <span className="pr-4 dark:text-white text-lg text-amber-600 font-semibold">Année</span>
				  {selected?.getFullYear() || "-"}
				</div>
			  }
			/>
		  </SelectTrigger>
		  <SelectContent>
			<ScrollArea className="h-48 bg-slate-100">
			  {Array.from({ length: endYear - startYear + 1 }, (_, i) => (
				<SelectItem key={i + startYear} value={(i + startYear).toString()}>
				  {i + startYear}
				</SelectItem>
			  ))}
			</ScrollArea>
		  </SelectContent>
		</Select>

		{error && <div className="text-red-500">{error}</div>}
	  </div>
	);
  };
