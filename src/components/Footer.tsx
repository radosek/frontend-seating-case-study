import { Button } from "@/components/ui/button.tsx";
import { formatPriceCzk } from "@/lib/utils";

type Props = {
	cart: T_Cart;
};

// bottom cart affix (wrapper)
export function Footer({ cart }: Props) {
	return (
		<footer className="sticky bottom-0 left-0 right-0 bg-white text-black/70 border-t border-zinc-200 flex justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
				{/* total in cart state */}
				<div className="flex flex-col">
					{cart.tickets.length ? <span>Total for {cart.tickets.length} tickets</span> : <span>No tickets in cart</span>}
					<span className="text-2xl font-semibold">{formatPriceCzk(cart.total <= 0 ? 0 : cart.total)}</span>
				</div>

				{/* checkout button */}
				<Button disabled variant="default">
					Checkout now
				</Button>
			</div>
		</footer>
	);
}
