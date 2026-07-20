import { revalidateLogic, useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight, Key } from "lucide-react";
import { useState } from "react";
import z, { email, string } from "zod";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "./ui";

export function Login() {
	const [stage, setStage] = useState<"email" | "password">("email");

	const formSchema = z.object({
		email: email("Please enter a valid Email.").min(
			1,
			"Please enter an Email.",
		),
		password: string().min(1, "Please enter a password."),
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			if (stage === "email") {
				setStage("password");
				return;
			}
		},
	});

	const Email = () => (
		<form.Field
			name="email"
			validators={{ onDynamic: formSchema.shape.email }}
			children={(field) => {
				const isInvalid = !field.state.meta.isValid;

				return (
					<Field data-invalid={isInvalid}>
						<span className="flex flex-row items-stretch">
							<Input
								field={field}
								type="email"
								placeholder="Email"
								isInvalid={isInvalid}
							/>
							<Button type="submit" size="icon" className="border-0 ring-inset">
								<ArrowRight />
							</Button>
						</span>
						{isInvalid && <FieldError errors={field.state.meta.errors} />}
					</Field>
				);
			}}
		/>
	);

	const Password = () => (
		<form.Field
			name="password"
			validators={{ onDynamic: formSchema.shape.password }}
			children={(field) => {
				const isInvalid = !field.state.meta.isValid;

				return (
					<Field data-invalid={isInvalid}>
						<span className="flex flex-row items-stretch">
							<Input
								field={field}
								type="password"
								placeholder="Password"
								isInvalid={isInvalid}
							/>
							<Button type="submit" size="icon" className="border-0 ring-inset">
								<Key />
							</Button>
						</span>
						{isInvalid && <FieldError errors={field.state.meta.errors} />}
					</Field>
				);
			}}
		/>
	);

	return (
		<form
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			{stage === "password" && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="absolute top-2 left-2"
					onClick={() => setStage("email")}
				>
					<ArrowLeft />
				</Button>
			)}
			{stage === "email" && <Email />}
			{stage === "password" && <Password />}
		</form>
	);
}
