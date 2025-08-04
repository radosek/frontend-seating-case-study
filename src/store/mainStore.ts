import { defineModule } from "zoov";
import { setAutoFreeze } from "immer";
//import { temporal } from "zundo";
//import diff from "microdiff";
//import { isNotEmptyObject } from "@/functions";
//import throttle from "just-throttle";

setAutoFreeze(false);

import USER from "./slice/user";
import EVENT from "./slice/event";
import EVENT_TICKETS from "./slice/eventTickets";
import CART from "./slice/cart";

const DEFAULT = structuredClone({
	user: USER.VALUES,
	event: EVENT.VALUES,
	eventTickets: EVENT_TICKETS.VALUES,
	cart: CART.VALUES,
});

export const StoreModule = defineModule(DEFAULT)
	.actions({
		...USER.ACTIONS,
		...EVENT.ACTIONS,
		...EVENT_TICKETS.ACTIONS,
		...CART.ACTIONS,
	})
	.methods(({ getActions, getState }) => ({
		updateCart(
			isInCart: boolean,
			seat: T_EventTickets["seatRows"][number]["seats"][number],
			row: T_EventTickets["seatRows"][number]["seatRow"],
			price: T_EventTickets["ticketTypes"][number]["price"],
		) {
			const cartTotal = getState().cart.total;

			if (isInCart) getActions().removeCartTicket({ ...seat, row });
			else getActions().addCartTicket({ ...seat, row });

			getActions().setCartTotal(isInCart ? cartTotal - price : cartTotal + price);
		},
	}))
	.build();
