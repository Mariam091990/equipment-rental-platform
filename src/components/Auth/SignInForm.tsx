"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function SigninForm() {

    const router = useRouter();
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries()) as
            {

                email: string,
                password: string

            };

        const { data: resData, error } = await authClient.signIn.email({
            ...user,
        })

        if (error) {
            console.log(error);
            toast.error(error.message as string);
        }
        else {
            console.log(resData);
            toast.success("Sign in done successfully");
            router.push("/");

        }
    }

    const handleGoogleSignIn = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data);
    }

    const handleGithubSignIn = async () => {
        const data = await authClient.signIn.social({
            provider: "github",
        });
        console.log(data);
    }

    return (
        <div className=" mt-5 flex flex-col max-w-1/2 mx-auto gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome </CardTitle>
                    <CardDescription>
                        Login with your GitHub account
                    </CardDescription>
                </CardHeader>
                <CardContent className="mx-auto">

                    <div >
                        <Button onClick={handleGoogleSignIn} variant="outline" type="button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="size-5"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.47-4.72 7.16l7.28 5.65c4.25-3.92 6.48-9.69 6.48-17.28Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.9-5.78l-7.28-5.65c-2.02 1.35-4.6 2.15-8.62 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                                />
                            </svg>
                            Login with Google
                        </Button>

                        <p>---------------------------------</p>
                    </div>

                    <div >
                        <Button onClick={handleGithubSignIn} variant="outline" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"

                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6.006 0c2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.216.694.825.576A12 12 0 0 0 12 0Z"
                                />
                            </svg>
                            Login with GitHub
                        </Button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <FieldGroup>
                            <Field>


                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    {/* <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t you have an account? <a href="/signUp">Register</a> first!
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
