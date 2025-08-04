import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ cart: T_Cart }>;

const VALUES: T_Cart = { tickets: [], total: 0 };

const ACTIONS = {
	setCartData(draft: Draft, cart: T_Cart) {
		draft.cart = cart;
	},
	addCartTicket({ cart }: Draft, ticket: T_Cart["tickets"][number]) {
		cart.tickets = [...cart.tickets, ticket];
	},
	removeCartTicket({ cart }: Draft, ticket: T_Cart["tickets"][number]) {
		cart.tickets = cart.tickets.filter((_ticket) => _ticket.seatId !== ticket.seatId);
	},
	setCartTotal({ cart }: Draft, total: T_Cart["total"]) {
		cart.total = total;
	},
};

export default { VALUES, ACTIONS };
