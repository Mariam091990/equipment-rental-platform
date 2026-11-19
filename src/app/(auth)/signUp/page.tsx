import SignupForm from "@/components/Auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Accout | Equipment Rental Platform",
    description: "Create Account page for Equipment Rental Platform",

}

const page = () => {
    return (
        <div>
<SignupForm/>
        </div>
    );
};

export default page;