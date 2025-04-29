import  { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      /** Existing Next Auth fields */
      name?: string | null
      email?: string | null
      image?: string | null
      
      /** Custom fields */
      isVerified?: boolean
      // Add any other custom fields you have
    } & DefaultSession["user"]
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    /** Custom fields */
    isVerified?: boolean
    // Add any other custom fields you have
  }
}