import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatPriceCzk(value?: number) {
	return value == null
		? "—"
		: new Intl.NumberFormat("cs-CZ", {
				style: "currency",
				currency: "CZK",
				maximumFractionDigits: 0,
			}).format(value);
}
