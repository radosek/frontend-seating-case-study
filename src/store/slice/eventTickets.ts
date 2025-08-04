import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ eventTickets: T_EventTickets | null }>;

const VALUES = null as T_EventTickets | null;

const ACTIONS = {
	setEventTickets(draft: Draft, eventTickets: T_EventTickets) {
		draft.eventTickets = eventTickets;
	},
	setTicketTypes(draft: Draft, ticketTypes: T_EventTickets["ticketTypes"]) {
		if (!draft.eventTickets) {
			// TODO: Throw error or show different UI as API data object is not correct
			return;
		}
		draft.eventTickets.ticketTypes = ticketTypes;
	},
};

export default { VALUES, ACTIONS };
