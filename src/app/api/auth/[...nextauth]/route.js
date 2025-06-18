import NextAuth from "next-auth";
import authOptions from "./authOption";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;