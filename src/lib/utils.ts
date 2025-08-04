import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { google, outlook, ics } from "calendar-link";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// --- utils: stable color per ticketTypeId ---
export function hashToHue(input: string) {
	let h = 0;
	for (let i = 0; i < input.length; i++) {
		h = (h * 31 + input.charCodeAt(i)) % 360;
	}
	return h; // 0..359
}

export function colorForType(ticketTypeId: string) {
	// pleasant mids (not too pale, not too dark)
	const h = hashToHue(ticketTypeId);
	const s = 65; // %
	const l = 78; // %
	return `hsl(${h} ${s}% ${l}%)`;
}

export function textColorForBgHsl(lightnessPercent = 78) {
	return lightnessPercent < 55 ? "#fff" : "#111";
}

export function getEventCalendarLinks(event: T_Event) {
	const base = {
		uid: event.eventId,
		title: event.namePub,
		description: event.description,
		location: event.place,
		start: event.dateFrom, // ISO-8601, stays in UTC
		end: event.dateTo,
	};

	return {
		google: google(base), // → https://calendar.google.com/…
		outlook: outlook(base), // → https://outlook.office.com/…
		icsBlobUrl: URL.createObjectURL(new Blob([ics(base)], { type: "text/calendar;charset=utf-8" })),
	};
}
