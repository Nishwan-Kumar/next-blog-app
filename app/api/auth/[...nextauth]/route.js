import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Point to the new file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };