import { StoreModule } from "@/store/mainStore";
import { useTrackedModule } from "zoov/tracked";
import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Props = {
	currencyIso: T_Event["currencyIso"] | null;
};

const DEFAULT_USER_OBJECT = {
	firstName: "",
	lastName: "",
	email: "",
};

export function Footer({ currencyIso }: Props) {
	const [{ event, cart, user, eventTickets }, actions] = useTrackedModule(StoreModule);

	const [showDialog, setShowDialog] = useState(false);
	const [innerUser, setInnerUser] = useState<T_User>(DEFAULT_USER_OBJECT);
	const [processing, setProcessing] = useState(false);

	const { t } = useTranslation();

	function handleRemove(
		seat: T_EventTickets["seatRows"][number]["seats"][number],
		row: T_EventTickets["seatRows"][number]["seatRow"],
		price: number,
	) {
		actions.updateCart(true, seat, row, price);
	}

	function findTicketType(ticketTypeId: string) {
		return eventTickets?.ticketTypes?.find(({ id }) => id === ticketTypeId);
	}

	async function handlePay() {
		if (!cart.tickets.length) return;

		const payload = {
			eventId: event?.eventId ?? "", // fallback empty string
			tickets: cart.tickets.map(({ ticketTypeId, seatId }) => ({ ticketTypeId, seatId })),
			user: {
				email: user?.email || innerUser.email,
				firstName: user?.firstName || innerUser.firstName,
				lastName: user?.lastName || innerUser.lastName,
			},
		};

		if (!payload.user.email || !payload.user.firstName || !payload.user.lastName) {
			toast.error("Please fill all fileds");
			return;
		}

		setProcessing(true);
		try {
			const res = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message ?? "Order failed");
			}

			const data = await res.json();
			toast.success(data.message ?? `Order ${data.orderId} created`);

			actions.clearCart();
			setShowDialog(false);
		} catch (err: unknown) {
			toast.error((err as Error).message ?? "Order failed");
		} finally {
			setProcessing(false);
		}
	}

	return (
		<footer className="sticky bottom-0 left-0 right-0 bg-white text-zinc-900 border-t border-zinc-200 flex justify-center z-50">
			<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
				{/* Cart summary */}
				<div className="flex flex-col">
					{cart.tickets.length ? (
						<span>{t("totalForTickets", { count: cart.tickets.length })}</span>
					) : (
						<span>{t("noTicketsInCart")}</span>
					)}
					<span className="text-2xl font-semibold">
						{cart.total <= 0 ? 0 : cart.total} {currencyIso ?? ""}
					</span>
				</div>

				{/* Checkout button & dialog */}
				<Dialog open={showDialog} onOpenChange={setShowDialog}>
					<DialogTrigger asChild>
						<Button disabled={!cart.tickets.length || cart.total <= 0} variant="default" onClick={() => setShowDialog(true)}>
							{t("checkoutNow")}
						</Button>
					</DialogTrigger>
					<DialogContent className="w-[90%] md:max-w-lg mx-auto max-w-lg text-zinc-900">
						<DialogHeader>
							<DialogTitle>{t("reviewYourTickets")}</DialogTitle>
							<DialogDescription>{t("verifySelection")}</DialogDescription>
						</DialogHeader>

						{/* Ticket list */}
						{cart.tickets.length ? (
							<ScrollArea className="max-h-60 pr-4">
								<div className="space-y-3">
									{cart.tickets.map(({ seatId, place, ticketTypeId, row }) => {
										const ticketType = findTicketType(ticketTypeId);

										if (!ticketType) return null;

										return (
											<div key={seatId} className="flex justify-between items-center">
												<div className="flex flex-col text-sm">
													<span className="font-medium">
														{t("row")} {row ?? "-"} &middot; {t("seat")} {place}
													</span>
													<span className="text-zinc-500">{ticketType.name}</span>
												</div>
												<div className="flex items-center gap-4">
													<span className="whitespace-nowrap">
														{ticketType.price ?? 0} {currencyIso}
													</span>
													<Button
														size="icon"
														variant="ghost"
														onClick={() => handleRemove({ seatId, place, ticketTypeId }, row, ticketType.price)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							</ScrollArea>
						) : (
							<p className="text-sm text-center text-zinc-500">{t("yourCartIsEmpty")}</p>
						)}

						<Separator />

						<div className="flex gap-2">
							{!user?.firstName && (
								<div className="grid gap-2 w-full">
									<Label htmlFor="email">{t("firstName")}</Label>
									<Input
										id="first-name"
										type="string"
										value={innerUser.firstName}
										onChange={(e) => setInnerUser((s) => ({ ...s, firstName: e.target.value }))}
										required
									/>
								</div>
							)}

							{!user?.lastName && (
								<div className="grid gap-2 w-full">
									<Label htmlFor="email">{t("lastName")}</Label>
									<Input
										id="last-name"
										type="string"
										value={innerUser.lastName}
										onChange={(e) => setInnerUser((s) => ({ ...s, lastName: e.target.value }))}
										required
									/>
								</div>
							)}
						</div>

						{!user?.email && (
							<div className="grid gap-2">
								<Label htmlFor="email">{t("emailForTickets")}</Label>
								<Input
									id="email"
									type="email"
									value={innerUser.email}
									onChange={(e) => setInnerUser((s) => ({ ...s, email: e.target.value }))}
									required
								/>
							</div>
						)}

						{/* Order summary */}
						<div className="flex justify-between text-lg font-medium">
							<span>{t("total")}</span>
							<span>
								{cart.total <= 0 ? 0 : cart.total} {currencyIso}
							</span>
						</div>

						{/* Pay button */}
						<Button className="w-full" onClick={handlePay} disabled={processing || !cart.tickets.length}>
							{processing ? t("processing") : t("pay")}
						</Button>
					</DialogContent>
				</Dialog>
			</div>
		</footer>
	);
}
