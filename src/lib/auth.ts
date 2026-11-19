import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME as string);



export const auth = betterAuth({

    database: mongodbAdapter(db, {
        client,
    }),

    user: {
        additionalFields: {
            role: {
                type: ["admin", "owner", "customer"],
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
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
});