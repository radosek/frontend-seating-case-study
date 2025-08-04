import { Button } from "@/components/ui/button.tsx";

type Props = {
	event: T_Event | null;
};

export function Aside({ event }: Props) {
	if (!event) {
		// TODO: add skeleton or something
		return null;
	}

	return (
		<div className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
			{/* event image */}
			<img src={event.headerImageUrl} alt="" className="bg-zinc-100 rounded-md h-32 object-cover" />
			{/* event name */}
			<h1 className="text-xl text-zinc-900 font-semibold">{event.namePub}</h1>
			{/* event description */}
			<p className="text-sm text-zinc-500">{event.description}</p>
			{/* add to calendar button */}
			<Button variant="secondary" disabled>
				Add to calendar
			</Button>
		</div>
	);
}
