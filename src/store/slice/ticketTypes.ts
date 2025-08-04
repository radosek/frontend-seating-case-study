import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ ticketTypes: T_EventTickets["ticketTypes"] }>;

const VALUES: T_EventTickets["ticketTypes"] = [];

const ACTIONS = {
	setTicketTypes(draft: Draft, ticketTypes: T_EventTickets["ticketTypes"]) {
		draft.ticketTypes = ticketTypes;
	},
};

export default { VALUES, ACTIONS };
