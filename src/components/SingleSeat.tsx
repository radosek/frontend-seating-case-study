import { StoreModule } from "@/store/mainStore";
import { useTrackedModule } from "zoov/tracked";

import { forwardRef, useState } from "react";
import { colorForType, textColorForBgHsl } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import { useTranslation } from "react-i18next";

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	place: number;
	row: T_EventTickets["seatRows"][number];
}

export const SingleSeat = forwardRef<HTMLDivElement, SeatProps>(({ row, place }, ref) => {
	const [{ event, cart, eventTickets }, actions] = useTrackedModule(StoreModule);

	const [popoverOpen, setPopoverOpen] = useState(false);

	const byPlace = new Map(row.seats.map((s) => [s.place, s]));
	const seat: T_EventTickets["seatRows"][number]["seats"][number] | undefined = byPlace.get(place);

	const { t } = useTranslation();

	if (!seat) {
		// Unavailable / sold / not present in feed
		return (
			<button
				type="button"
				key={place}
				disabled
				title={`Row ${row.seatRow} • Place ${place} • Unavailable`}
				className="h-9 rounded-lg border text-sm text-neutral-500 cursor-not-allowed flex items-center justify-center"
				style={{
					backgroundImage: "repeating-linear-gradient(45deg,#f1f1f1, #f1f1f1 6px, #e5e5e5 6px, #e5e5e5 12px)",
				}}
			>
				{place}
			</button>
		);
	}

	const ticketType = eventTickets?.ticketTypes?.find(
		({ id }) => id === (seat as T_EventTickets["seatRows"][number]["seats"][number]).ticketTypeId,
	);

	const isInCart = Boolean(cart.tickets.find((ticket) => ticket.seatId === seat.seatId));

	function handleCartUpdate() {
		actions.updateCart(
			isInCart,
			seat as T_EventTickets["seatRows"][number]["seats"][number],
			row.seatRow,
			ticketType?.price ?? 0,
		);
		setPopoverOpen(false);
	}

	// ? Not needed, but why not
	function handleContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setPopoverOpen(!popoverOpen);
	}

	const bg = colorForType(seat.ticketTypeId);
	const fg = textColorForBgHsl(78);

	const popTriggerClass = [
		"h-9 rounded-md border text-xs transition",
		"hover:ring-2 hover:ring-zinc-950/40",
		isInCart ? "ring-2 ring-zinc-950" : "",
	].join(" ");

	return (
		<Popover open={popoverOpen} onOpenChange={(change) => setPopoverOpen(change)}>
			<PopoverTrigger
				onContextMenu={handleContextMenu}
				title={`Row ${row.seatRow} • Place ${place}`}
				className={popTriggerClass}
				style={{ backgroundColor: bg, color: fg }}
			>
				<div ref={ref}>{place}</div>
			</PopoverTrigger>

			<PopoverContent className="w-64 p-4 bg-white rounded-lg shadow-md border border-zinc-200">
				<div className="flex flex-col gap-3">
					<h3 className="text-lg font-semibold text-zinc-900 text-center">{t("seatDetails")}</h3>
					<div className="flex justify-between text-sm text-zinc-600">
						<span>{t("row")}:</span>
						<span className="font-medium">{row.seatRow}</span>
					</div>
					<div className="flex justify-between text-sm text-zinc-600">
						<span>{t("seat")}:</span>
						<span className="font-medium">{place}</span>
					</div>
					<div className="flex justify-between text-sm text-zinc-600">
						<span>{t("ticketType")}:</span>
						<span className="font-medium">{ticketType?.name ?? "Unknown"}</span>
					</div>
					<div className="flex justify-between text-sm text-zinc-600">
						<span>{t("price")}:</span>
						<span className="font-medium text-xl text-zinc-900">
							{ticketType?.price ?? 0} {event?.currencyIso ?? ""}
						</span>
					</div>

					<Button variant={isInCart ? "destructive" : "default"} className="w-full mt-2" onClick={handleCartUpdate}>
						{isInCart ? t("removeFromCart") : t("addToCart")}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
});
