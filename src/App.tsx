import { StoreModule } from "@/store/mainStore";
import { useTrackedModule } from "zoov/tracked";
import { useMemo } from "react";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";
import { colorForType, textColorForBgHsl } from "@/lib/utils";

import { Nav } from "@/components/Nav";
import { Aside } from "@/components/Aside";
import { Footer } from "@/components/Footer";
import { SeatRow } from "@/components/SeatRow.tsx";

import { Skeleton } from "@/components/ui/skeleton";

import "./App.css";

const isLoggedIn = false;

export function App() {
	const [{ event, eventTickets, cart }, actions] = useTrackedModule(StoreModule);

	// TODO: error handling
	async function fetchEventTickets(eventId: T_Event["eventId"]) {
		const eventTicketsObject: T_EventTickets = await fetch(
			`https://nfctron-frontend-seating-case-study-2024.vercel.app/event-tickets?eventId=${eventId}`,
		).then((res) => res.json());

		actions.setEventTickets(eventTicketsObject);
		actions.setTicketTypes(eventTicketsObject.ticketTypes);
	}

	// TODO: error handling
	async function fetchEvent() {
		const eventObject: T_Event = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/event").then((res) =>
			res.json(),
		);

		actions.setEvent(eventObject);
		fetchEventTickets(eventObject.eventId);
	}

	const rows: T_EventTickets["seatRows"] = useMemo(
		() => [...(eventTickets?.seatRows ?? [])].sort((a, b) => a.seatRow - b.seatRow),
		[eventTickets?.seatRows],
	);

	const apiTicketTypes = useMemo(() => {
		const set = new Set<string>();
		rows.forEach((r) => r.seats.forEach((s) => set.add(s.ticketTypeId)));
		return [...set];
	}, [rows]);

	//function toggle(seat: Seat) {
	//	setSelected((prev) => {
	//		const next = new Set(prev);
	//		if (next.has(seat.seatId)) next.delete(seat.seatId);
	//		else next.add(seat.seatId);
	//		onChange?.([...next]);
	//		return next;
	//	});
	//}

	function findTicketTypeName(ticketTypeId: string) {
		return eventTickets?.ticketTypes?.find(({ id }) => id === ticketTypeId)?.name ?? "NO NAME";
	}

	useDidMountEffect(() => {
		fetchEvent();
	}, []);

	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<Nav isLoggedIn={isLoggedIn} />

			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center">
				{/* inner content */}
				<section className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
					{/* Seat map */}
					<div className="bg-white rounded-md flex flex-col p-3 w-full self-stretch shadow-sm space-y-3">
						{rows.map((row) => (
							<SeatRow row={row} key={row.seatRow} />
						))}

						{/* Legend */}
						<div className="flex flex-wrap items-center justify-center gap-4 pt-2 ">
							{apiTicketTypes.map((tid) => {
								const bg = colorForType(tid);
								const fg = textColorForBgHsl(78);
								return (
									<div key={tid} className="flex items-center gap-2 text-xs">
										<span className="inline-block h-4 w-6 rounded border" style={{ backgroundColor: bg }} aria-hidden />
										<span className="font-medium bg-white p-2 rounded" style={{ color: fg }}>
											{findTicketTypeName(tid)}
										</span>
									</div>
								);
							})}

							<div className="flex items-center gap-2 text-xs">
								<span
									className="inline-block h-4 w-6 rounded border"
									style={{
										backgroundImage: "repeating-linear-gradient(45deg,#f1f1f1, #f1f1f1 6px, #e5e5e5 6px, #e5e5e5 12px)",
									}}
								/>
								<span className="text-black p-2 rounded">Unavailable</span>
							</div>
						</div>
					</div>

					{/* event info */}
					{event ? <Aside event={event} /> : <Skeleton className="h-[20px] w-[100px] rounded-full" />}
				</section>
			</main>

			{/* bottom cart affix (wrapper) */}
			<Footer cart={cart} currencyIso={event?.currencyIso || null} />
		</div>
	);
}
