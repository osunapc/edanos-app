import { forwardRef } from "react";

import { ForwardedRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref: ForwardedRef<HTMLInputElement>) => (
	<input
		{...props}
		ref={ref}
		className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
	/>
));
