import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ cart: T_Cart }>;

const VALUES: T_Cart = { tickets: [], total: 0 };

const ACTIONS = {
	clearCart(draft: Draft) {
		draft.cart = { tickets: [], total: 0 };
	},
	addCartTicket(
		{ cart }: Draft,
		ticketWithRow: T_Cart["tickets"][number] & { row: T_EventTickets["seatRows"][number]["seatRow"] },
	) {
		cart.tickets = [...cart.tickets, ticketWithRow];
	},
	removeCartTicket({ cart }: Draft, ticket: T_Cart["tickets"][number]) {
		cart.tickets = cart.tickets.filter((_ticket) => _ticket.seatId !== ticket.seatId);
	},
	setCartTotal({ cart }: Draft, total: T_Cart["total"]) {
		cart.total = total;
	},
};

export default { VALUES, ACTIONS };
