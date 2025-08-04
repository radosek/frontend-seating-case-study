import { SingleSeat } from "@/components/SingleSeat.tsx";

type Props = {
	row: T_EventTickets["seatRows"][number];
};

export function SeatRow({ row }: Props) {
	const maxPlaceInRow = row.seats.length > 0 ? Math.max(...row.seats.map((s) => s.place)) : 0;

	return (
		<div key={row.seatRow} className="space-y-1">
			<div className="text-xs opacity-70">Row {row.seatRow}</div>

			<div
				className="grid gap-2"
				style={{
					gridTemplateColumns: `repeat(${maxPlaceInRow}, minmax(0,1fr))`,
				}}
			>
				{Array.from({ length: maxPlaceInRow }, (_, i) => i + 1).map((place) => (
					<SingleSeat key={place} row={row} place={place} />
				))}
			</div>
		</div>
	);
}
