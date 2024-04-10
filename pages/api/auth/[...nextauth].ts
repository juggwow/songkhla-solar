import clientPromise from "@/lib/mongodb"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
        clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string
      })
  ],
  callback: {
    signIn:async () => {
        console.log("test")
        return true
    }
  }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
          clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
      signIn:async ({user}) => {
        if(!user.email){
            return false
        }
        const mongoClient = await clientPromise
        mongoClient.connect()
        
        const resultFindEmail = await mongoClient.db("digital-tr").collection("emails").findOne({email:user.email})
        if(!resultFindEmail){
            return false
        }
        return true
      }
    }
  })