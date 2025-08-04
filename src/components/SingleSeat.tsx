import { StoreModule } from "@/store/mainStore";
import { useTrackedModule } from "zoov/tracked";

import { forwardRef, useState } from "react";
import { colorForType, textColorForBgHsl, formatPriceCzk } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	place: number;
	row: T_EventTickets["seatRows"][number];
}

export const SingleSeat = forwardRef<HTMLDivElement, SeatProps>(({ row, place }, ref) => {
	const [{ cart, ticketTypes }, actions] = useTrackedModule(StoreModule);

	const [popoverOpen, setPopoverOpen] = useState(false);

	const byPlace = new Map(row.seats.map((s) => [s.place, s]));
	const seat: T_EventTickets["seatRows"][number]["seats"][number] | undefined = byPlace.get(place);

	if (!seat) {
		// Unavailable / sold / not present in feed
		return (
			<button
				type="button"
				key={place}
				disabled
				title={`Row ${row.seatRow} • Place ${place} • Unavailable`}
				className="h-9 rounded-md border text-xs text-neutral-500 cursor-not-allowed"
				style={{
					backgroundImage: "repeating-linear-gradient(45deg,#f1f1f1, #f1f1f1 6px, #e5e5e5 6px, #e5e5e5 12px)",
				}}
			>
				{place}
			</button>
		);
	}

	const ticketType = ticketTypes?.find(
		({ id }) => id === (seat as T_EventTickets["seatRows"][number]["seats"][number]).ticketTypeId,
	);

	const isInCart = Boolean(cart.tickets.find((ticket) => ticket.seatId === seat.seatId));

	function handleCartUpdate() {
		actions.updateCart(isInCart, seat as T_EventTickets["seatRows"][number]["seats"][number], ticketType?.price ?? 0);
		setPopoverOpen(false);
	}

	function handleContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setPopoverOpen(!popoverOpen);
	}

	const bg = colorForType(seat.ticketTypeId);
	const fg = textColorForBgHsl(78);

	return (
		<Popover open={popoverOpen} onOpenChange={(change) => setPopoverOpen(change)}>
			<PopoverTrigger
				onContextMenu={handleContextMenu}
				title={`Row ${row.seatRow} • Place ${place}`}
				className={[
					"h-9 rounded-md border text-xs transition",
					"hover:ring-2 hover:ring-black/40",
					isInCart ? "ring-2 ring-black" : "",
				].join(" ")}
				style={{
					backgroundColor: bg,
					color: fg,
				}}
			>
				<div ref={ref}>{place}</div>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col text-center">
					<p className="text-sm font-medium leading-none tracking-tight text-neutral-800">{ticketType?.name ?? "Neznámý typ"}</p>

					<p className="text-2xl font-bold text-primary">{formatPriceCzk(ticketType?.price)}</p>

					<Button variant={isInCart ? "destructive" : "default"} size="sm" onClick={handleCartUpdate}>
						{isInCart ? "Remove from cart" : "Add to cart"}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
});
