import type { AnyFieldApi } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Input as InputNative } from "../ui/input";

export function Input({
	field,
	isInvalid,
	...props
}: {
	field: AnyFieldApi;
	isInvalid: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<InputNative
			{...props}
			id={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(e) => field.handleChange(e.target.value)}
			className={cn("ring-inset", props.className)}
			aria-invalid={isInvalid}
		/>
	);
}
