import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME as string);



export const auth = betterAuth({

    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db, {
        client,
    }),

    user: {
        additionalFields: {
            role: {
                type: ["admin", "owner", "customer"],
                required: true,
                input: false,
                defaultValue: "customer"
            }
        }
    },

    //...other options
    emailAndPassword: {
        enabled: true,
    },


    socialProviders: {
        google: {


            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        },

        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"] // Add your providers
        }
    },

    plugins: [
        jwt(),
    ],

    trustedOrigins: [
        "http://localhost:3000",
        "https://equipment-rental-platform-client.vercel.app",
    ],


});