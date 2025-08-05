import { StoreModule } from "@/store/mainStore";
import { useTrackedModule } from "zoov/tracked";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Avatar from "boring-avatars";
import { toast } from "sonner";

export function Nav() {
	const [{ user, event }, actions] = useTrackedModule(StoreModule);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { t, i18n } = useTranslation();
	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem("language", lng);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		try {
			const res = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error("Invalid credentials");
			}

			const data: T_UserRes = await res.json();
			actions.setUser(data.user);
			toast.success(data.message ?? "Logged in");
		} catch (error: unknown) {
			toast.error((error as Error).message ?? "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => actions.setUser(null);

	return (
		<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
			<div className="max-w-screen-lg p-4 grow grid grid-cols-3 items-center gap-3">
				{/* Logo placeholder */}
				<div className="w-full flex">
					{event ? (
						<img src={event.headerImageUrl} alt={event.namePub} className="rounded-md size-12 object-cover" />
					) : (
						<div className="bg-zinc-100 rounded-md size-12" />
					)}
				</div>

				{/* Title placeholder */}
				{event ? (
					<span className="invisible sm:visible text-md md:text-lg text-zinc-900">{event.namePub}</span>
				) : (
					<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
				)}

				{/* Right side */}
				<div className="max-w-[250px] w-full flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="mr-2 text-zinc-900">
								({i18n.language.toUpperCase()})
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
							<DropdownMenuItem onClick={() => changeLanguage("cs")}>Čeština</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger>
								<div className="flex items-center gap-2 cursor-pointer">
									<div className="w-8 h-8">
										<Avatar variant="pixel" name={user.email} colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]} />
									</div>

									<div className="flex flex-col text-left">
										<span className="text-sm font-medium text-zinc-900">
											{user.firstName} {user.lastName}
										</span>
										<span className="text-xs text-zinc-500">{user.email}</span>
									</div>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[250px]">
								<DropdownMenuLabel>
									{user.firstName} {user.lastName}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
										{t("logout")}
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="secondary">{t("loginOrRegister")}</Button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-[280px]">
								<form onSubmit={handleLogin} className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="email">{t("email")}</Label>
										<Input
											id="email"
											type="email"
											autoCorrect="off"
											autoComplete="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">{t("password")}</Label>
										<Input
											id="password"
											type="password"
											autoCorrect="off"
											autoComplete="currentPassword"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
									<Button className="w-full" type="submit" disabled={loading}>
										{loading ? t("loggingIn") : t("login")}
									</Button>
								</form>
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>
		</nav>
	);
}
