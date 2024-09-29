import GoogleProvider from "next-auth/providers/google";
import connectDB from "../config/database";
import User from "../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //Invoked on successfull sign in

    async signIn({ profile }) {
      // 1. Connect to the databse
      await connectDB();
      // 2. Check if user already exists
      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        //Truncate username

        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      // 3. If user exists, return true
      //3. If not then create user
      //4. Return true to allow sign in

      return true;
    },

    //Session Callback Function that modifies the session object

    async session({ session }) {
      //1. Get user from the database

      const user = await User.findOne({ email: session.user.email });
      //2. Assign user id from session
      session.user.id = user._id.toString();
      //3. Return session
      return session;
    },
  },
};
