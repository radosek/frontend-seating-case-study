import { defineModule } from "zoov";
import { setAutoFreeze } from "immer";
//import { temporal } from "zundo";
//import diff from "microdiff";
//import { isNotEmptyObject } from "@/functions";
//import throttle from "just-throttle";

setAutoFreeze(false);

import CART from "./slice/cart";
import TICKET_TYPES from "./slice/ticketTypes";

const DEFAULT = structuredClone({
	ticketTypes: TICKET_TYPES.VALUES,
	cart: CART.VALUES,
});

export const StoreModule = defineModule(DEFAULT)
	.actions({
		...TICKET_TYPES.ACTIONS,
		...CART.ACTIONS,
	})
	.methods(({ getActions, getState }) => ({
		updateCart(
			isInCart: boolean,
			seat: T_EventTickets["seatRows"][number]["seats"][number],
			price: T_EventTickets["ticketTypes"][number]["price"],
		) {
			const cartTotal = getState().cart.total;

			if (isInCart) getActions().removeCartTicket(seat);
			else getActions().addCartTicket(seat);

			getActions().setCartTotal(isInCart ? cartTotal - price : cartTotal + price);
		},
	}))
	//.middleware((store) =>
	//  temporal(store, {
	//    partialize: (state) => {
	//      const { trigger, isGlobal, name } = state;
	//      return { trigger, isGlobal, name };
	//    },
	//    handleSet: (handleSet) =>
	//      throttle<typeof handleSet>((state) => {
	//        handleSet(state);
	//      }, 1000),
	//    //equality: (pastState, currentState) =>
	//    //  pastState.isGlobal !== currentState.isGlobal && pastState.trigger !== currentState.trigger,
	//    diff: (pastState, currentState) => {
	//      const myDiff = diff(currentState, pastState);
	//      const newStateFromDiff = myDiff.reduce(
	//        (acc, difference) => {
	//          type Key = keyof typeof currentState;
	//          if (difference.type === "CHANGE") {
	//            const pathAsString = difference.path.join(".") as Key;
	//            acc[pathAsString] = difference.value;
	//          }
	//          return acc;
	//        },
	//        {} as Partial<typeof currentState>,
	//      );
	//      return isNotEmptyObject(newStateFromDiff) ? newStateFromDiff : null;
	//    },
	//    limit: 100,
	//  }),
	//)
	.build();
