import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getEventCalendarLinks } from "@/lib/utils";

type Props = { event: T_Event };

export function Aside({ event }: Props) {
	const formattedDateFrom = new Date(event.dateFrom).toLocaleString("default", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
	const formattedDateTo = new Date(event.dateTo).toLocaleString("default", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	const eventLinks = getEventCalendarLinks(event);

	return (
		<div className="w-full md:max-w-sm bg-white rounded-md shadow-sm p-4 flex flex-col gap-4">
			<img src={event.headerImageUrl} alt="" className="w-full h-auto rounded-md bg-zinc-100" />
			<h1 className="text-xl text-zinc-900 font-semibold">{event.namePub}</h1>
			<p className="text-sm text-zinc-500">{event.description}</p>
			<p className="text-sm text-zinc-500 flex items-center gap-1 flex-wrap">
				<span>🗓️</span>
				<span>{formattedDateFrom}</span>
				<span>-</span>
				<span>{formattedDateTo}</span>
			</p>
			<a
				href={`https://mapy.cz/?q=${encodeURIComponent(event.place)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm text-zinc-500 hover:underline"
			>
				📍 {event.place}
			</a>

			<Popover>
				<PopoverTrigger asChild>
					<Button variant="default">Add to calendar</Button>
				</PopoverTrigger>

				<PopoverContent align="start" className="w-56">
					<ul className="flex flex-col gap-2 text-sm">
						<li>
							<a
								href={eventLinks.google}
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full text-left hover:underline"
							>
								Google Calendar
							</a>
						</li>
					</ul>
				</PopoverContent>
			</Popover>
		</div>
	);
}
