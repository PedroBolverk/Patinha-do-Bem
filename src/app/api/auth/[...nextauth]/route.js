import NextAuth from "next-auth";
import { authOptions } from "./routes";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
