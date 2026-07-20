import { revalidateLogic, useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import z, { email, string } from "zod";
import { authClient } from "@/lib/auth";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "./ui";

export function Register({ onSuccess }: { onSuccess?: () => void }) {
	const stages = ["email", "password", "profile"] as const;
	const [step, setStep] = useState<number>(0);
	const stage: (typeof stages)[number] | undefined = stages[step];

	const formSchema = z.object({
		email: email("Please enter a valid Email.").min(
			1,
			"Please enter an Email.",
		),
		password: string()
			.min(1, "Please enter a password.")
			.min(8, "Your password must be at least 8 Characters long."),
		name: string().min(1, "Please enter your name."),
		username: string()
			.min(3, "Your username must be at least 3 Characters long.")
			.max(30, "Your username must be at most 30 Characters long.")
			.regex(
				/^[a-zA-Z0-9_.]+$/,
				"Only letters, numbers, dots and underscores.",
			),

		displayUsername: string()
			.min(3, "Your username must be at least 3 Characters long.")
			.max(30, "Your username must be at most 30 Characters long."),
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
			username: "",
			displayUsername: "",
		},
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			if (step !== stages.length - 1) {
				setStep((prev) => ++prev);
				return;
			}

			const { error } = await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.name,
				username: value.username,
			});

			if (error) {
				throw new Error();
			}
			onSuccess?.();
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
								<ArrowRight />
							</Button>
						</span>
						{isInvalid && <FieldError errors={field.state.meta.errors} />}
					</Field>
				);
			}}
		/>
	);

	const Profile = () => (
		<div className="flex flex-col gap-2">
			<form.Field
				name="name"
				validators={{ onDynamic: formSchema.shape.name }}
				children={(field) => {
					const isInvalid = !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<Input
								field={field}
								type="text"
								placeholder="Full Name"
								isInvalid={isInvalid}
							/>
						</Field>
					);
				}}
			/>
			<form.Field
				name="username"
				validators={{ onDynamic: formSchema.shape.username }}
				children={(field) => {
					const isInvalid = !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<span className="flex flex-row items-stretch">
								<Input
									field={field}
									type="text"
									placeholder="Username"
									isInvalid={isInvalid}
								/>
								<Button
									type="submit"
									size="icon"
									className="border-0 ring-inset"
								>
									<Send />
								</Button>
							</span>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			/>
		</div>
	);

	return (
		<form
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			{step !== 0 && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="absolute top-2 left-2"
					onClick={() => setStep((prev) => --prev)}
				>
					<ArrowLeft />
				</Button>
			)}
			<form.Subscribe
				selector={(state) =>
					state.errorMap.onSubmit as string | { form?: string } | undefined
				}
				children={(error) => {
					const message = typeof error === "string" ? error : error?.form;
					return message ? <FieldError>{message}</FieldError> : null;
				}}
			/>
			{stage === "email" && <Email />}
			{stage === "password" && <Password />}
			{stage === "profile" && <Profile />}
		</form>
	);
}
