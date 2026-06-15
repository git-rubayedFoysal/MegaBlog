import { Client, Account, ID } from "appwrite";
import conf from "../config/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  //Create Account
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      if (userAccount) {
        try {
          return await this.login({ email, password });
        } catch (error) {
          if (
            error?.message?.includes(
              "Creation of a session is prohibited when a session is active",
            )
          ) {
            await this.logout();
            return await this.login({ email, password });
          }
          throw error;
        }
      }

      return userAccount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // user login
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get current login user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  // user logout
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log(error);
    }
  }
}

const authService = new AuthService();

export default authService;
