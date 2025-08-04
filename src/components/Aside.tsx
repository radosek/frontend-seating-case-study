import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getEventCalendarLinks } from "@/lib/utils";

type Props = { event: T_Event };

export function Aside({ event }: Props) {
	const eventLinks = getEventCalendarLinks(event);

	return (
		<div className="w-full md:max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
			<img src={event.headerImageUrl} alt="" className="bg-zinc-100 rounded-md h-32 object-cover" />
			<h1 className="text-xl text-zinc-900 font-semibold">{event.namePub}</h1>
			<p className="text-sm text-zinc-500 line-clamp-4">{event.description}</p>

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
