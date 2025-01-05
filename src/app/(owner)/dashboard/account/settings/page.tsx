"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
  } from "@/components/ui/form"

const FormSchema = z.object({
	marketing_emails: z.boolean().default(false),
	security_emails: z.boolean().default(true),
	auto_logout: z.boolean().default(false),
	inactivity_time: z.string().min(1).max(2).default("15"),
	language: z.string().default("fr"),
	timezone: z.string().default("Europe/Paris"),
	dateFormat: z.string().default("DD/MM/YYYY"),
	fontSize: z.number().min(12).max(24).default(16),
	highContrast: z.boolean().default(false),
	theme: z.string().default("system")
})

export default function SettingsPage() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			marketing_emails: false,
			security_emails: true,
			auto_logout: false,
			inactivity_time: "15",
			language: "fr",
			timezone: "Europe/Paris",
			dateFormat: "DD/MM/YYYY",
			fontSize: 16,
			highContrast: false,
			theme: "system"
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log("Paramètres sauvegardés:", data)
	}

	const [notifications, setNotifications] = useState({
		email: true,
		push: false,
		sms: true
	});
	const [theme, setTheme] = useState("system")
	const [autoLogout, setAutoLogout] = useState(true)
	const [inactivityTime, setInactivityTime] = useState("15")
	const [language, setLanguage] = useState("fr")
	const [timezone, setTimezone] = useState("Europe/Paris")
	const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
	const [fontSize, setFontSize] = useState(16)
	const [highContrast, setHighContrast] = useState(false)

	const handleNotificationChange = (type: keyof typeof notifications) => {
		setNotifications(prev => ({ ...prev, [type]: !prev[type] }))
	}

	const handleAutoLogoutChange = (checked: boolean) => {
		setAutoLogout(checked)
	}

	const handleInactivityTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInactivityTime(e.target.value)
	}

	const handleFontSizeChange = (value: number[]) => {
		setFontSize(value[0])
	}

	const handleSaveSettings = () => {
		console.log("Paramètres sauvegardés:", {
			notifications,
			theme,
			autoLogout,
			inactivityTime,
			language,
			timezone,
			dateFormat,
			fontSize,
			highContrast
		})
	}

	return (
		<>
			<header className="flex items-center gap-4 p-4">
				<div className="flex items-center gap-2 px-3">
					<SidebarTrigger />
					<Separator orientation="vertical" className="mr-2 h-4 \" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="text-xl hidden md:block">
								<BreadcrumbLink href="/dashboard">
									Dashboard
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem className="text-lg">
								<BreadcrumbPage>Paramètres</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="container p-4 mx-auto">

				<h1 className="mb-4 text-4xl font-krona font-bold">Paramètres</h1>
				<h2 className="mb-6 pb-4 text-2xl text-gray-600">Gérer ici les paramètres generaux de votre compte.</h2>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Notifications</CardTitle>
						<CardDescription className="text-lg">Gérez vos préférences de notifications.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
								<div>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="marketing_emails"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">
															Emails marketing
														</FormLabel>
														<FormDescription className="text-md">
																Receive emails about new products, features, and more.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="security_emails"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Security emails</FormLabel>
														<FormDescription className="text-md">
															Receive emails about your account security.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled
															aria-readonly
															className="bg-gray-300 data-[state=checked]:bg-amber-400 data-[state=checked]:hover:bg-amber-600"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>


				{/* Apparence */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Apparence</CardTitle>
						<CardDescription className="text-lg">Personnalisez l'apparence de l'application.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
								<div>
									<div className="space-y-4">
									<CardContent className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="theme" className="text-xl">Thème</Label>
							<Select value={theme} onValueChange={setTheme}>
								<SelectTrigger id="theme">
									<SelectValue placeholder="Sélectionnez un thème" className="text-md" />
								</SelectTrigger>
								<SelectContent className="bg-amber-200">
									<SelectItem value="light">Clair</SelectItem>
									<SelectItem value="dark">Sombre</SelectItem>
									<SelectItem value="system">Système</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>



				{/* Sécurité */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Sécurité</CardTitle>
						<CardDescription className="text-lg">Gérez les paramètres de sécurité de votre compte.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
								<div>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="auto_logout"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">
															Déconnexion automatique
														</FormLabel>
														<FormDescription className="text-md">
															Se déconnecter automatiquement après une période d'inactivité
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										{autoLogout && (
											<FormField
												control={form.control}
												name="inactivity_time"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<FormLabel className="text-xl">
																Temps d'inactivité
															</FormLabel>
															<FormDescription className="text-md">
																Définir le temps d'inactivité en minutes (1-60)
															</FormDescription>
														</div>
														<FormControl>
															<Input
																type="number"
																{...field}
																min="1"
																max="60"
																className="w-20"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										)}
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>


				{/* Préférences régionales */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Préférences régionales</CardTitle>
						<CardDescription className="text-lg">Personnalisez l'expérience selon vos préférences régionales.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
								<div className="space-y-4">
									<div>
										<FormField
											name="language"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Langue</FormLabel>
														<FormDescription className="text-md">
															Sélectionnez votre langue préférée
														</FormDescription>
													</div>
													<FormControl>
														<Select value={language} onValueChange={setLanguage}>
															<SelectTrigger id="language">
																<SelectValue placeholder="Sélectionnez une langue" />
															</SelectTrigger>
															<SelectContent className="text-lg bg-amber-200">
																<SelectItem value="fr">Français</SelectItem>
																<SelectItem value="en">English</SelectItem>
																<SelectItem value="es">Español</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											name="timezone"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Fuseau horaire</FormLabel>
														<FormDescription className="text-md pr-6">
															Choisissez votre fuseau horaire
														</FormDescription>
													</div>
													<FormControl>
														<Select value={timezone} onValueChange={setTimezone}>
															<SelectTrigger id="timezone">
																<SelectValue placeholder="Sélectionnez un fuseau horaire" />
															</SelectTrigger>
															<SelectContent className="text-lg bg-amber-200">
																<SelectItem value="Europe/Paris">Europe / Paris</SelectItem>
																<SelectItem value="America/New-York">America / New-York</SelectItem>
																<SelectItem value="Asia/Tokyo">Asia / Tokyo</SelectItem>
																<SelectItem value="Africa/Marrakech">Africa / Casablanca</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											name="dateFormat"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Format de date</FormLabel>
														<FormDescription className="text-md pr-4">
															Choisissez votre format de date
														</FormDescription>
													</div>
													<FormControl>
														<Select value={dateFormat} onValueChange={setDateFormat}>
															<SelectTrigger id="date-format">
																<SelectValue placeholder="Sélectionnez un format de date" />
															</SelectTrigger>
															<SelectContent className="text-lg bg-amber-200">
																<SelectItem value="DD/MM/YYYY">31/01/2000</SelectItem>
																<SelectItem value="MM/DD/YYYY">01/31/2000</SelectItem>
																<SelectItem value="YYYY-MM-DD">2000-01-31</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Accessibilité */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Accessibilité</CardTitle>
						<CardDescription className="text-lg">Ajustez les paramètres pour améliorer l'accessibilité.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
								<div className="space-y-4">
									<div>
										<FormField
											name="fontSize"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Taille de la police</FormLabel>
														<FormDescription className="text-md">
															Ajustez la taille de la police ({fontSize}px)
														</FormDescription>
													</div>
													<FormControl>
														<Slider
															id="font-size"
															min={12}
															max={24}
															step={1}
															value={[fontSize]}
															onValueChange={handleFontSizeChange}
															className="w-[120px] bg-amber-400"
														/>
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											name="highContrast"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-xl">Mode contraste élevé</FormLabel>
														<FormDescription className="text-md">
															Activer le mode contraste élevé
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={highContrast}
															onCheckedChange={setHighContrast}
															className="bg-amber-400 hover:bg-amber-600"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				<Button onClick={handleSaveSettings} className=" text-silver-500 bg-amber-400 text-lg hover:bg-amber-600">
					Sauvegarder les paramètres
				</Button>
			</div>
		</>
	)
}
