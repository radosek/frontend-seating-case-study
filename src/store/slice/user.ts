import type { WritableDraft } from "immer";

type Draft = WritableDraft<{ user: T_User | null }>;

const VALUES = null as T_User | null;

const ACTIONS = {
	setUser(draft: Draft, user: T_User | null) {
		draft.user = user;
	},
};

export default { VALUES, ACTIONS };
