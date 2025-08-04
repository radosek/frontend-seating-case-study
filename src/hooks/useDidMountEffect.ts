import { useEffect, useRef } from "react";

export function useDidMountEffect(func: any, deps: any): void {
	const didMount = useRef(false);

	useEffect((): void => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
}
