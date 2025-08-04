export {};

declare global {
	type T_Event = {
		eventId: string; // uuid
		namePub: string;
		description: string;
		currencyIso: string;
		dateFrom: string; // datetime
		dateTo: string; // datetime
		headerImageUrl: string;
		place: string;
	};

	type T_EventTickets = {
		ticketTypes: {
			id: string; // uuid
			name: string;
			price: number;
		}[];
		seatRows: {
			seatRow: number;
			seats: {
				seatId: string; // uuid
				place: number;
				ticketTypeId: string; // uuid
			}[];
		}[];
	};

	type T_Cart = {
		tickets: {
			seatId: T_EventTickets["seatRows"][number]["seats"][number]["seatId"];
			place: T_EventTickets["seatRows"][number]["seats"][number]["place"];
			ticketTypeId: T_EventTickets["seatRows"][number]["seats"][number]["ticketTypeId"];
			row: T_EventTickets["seatRows"][number]["seatRow"];
		}[];
		total: number;
	};

	type T_User = {
		firstName: string;
		lastName: string;
		email: string;
	};

	type T_UserRes = {
		message: string;
		user: T_User;
	};
}
