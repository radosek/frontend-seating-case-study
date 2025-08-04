import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ event: T_Event | null }>;

const VALUES = null as T_Event | null;

const ACTIONS = {
	setEvent(draft: Draft, event: T_Event) {
		draft.event = event;
	},
};

export default { VALUES, ACTIONS };
