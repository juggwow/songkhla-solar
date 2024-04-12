import clientPromise from "@/lib/mongodb";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async ({ user }: { user: User | AdapterUser }) => {
      if (!user.email) {
        return "/unauthorization";
      }
      const mongoClient = await clientPromise;
      await mongoClient.connect();

      const resultFindEmail = await mongoClient
        .db("digital-tr")
        .collection("emails")
        .findOne({ email: user.email });
      await mongoClient.close();
      if (!resultFindEmail) {
        return "/unauthorization";
      }
      return true;
    },
  },
  pages: {
    signIn: "/googlelogin",
  },
};

export default NextAuth(authOptions);
