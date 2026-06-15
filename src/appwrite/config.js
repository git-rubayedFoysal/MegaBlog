import { Client, Storage, Databases, ID, Query } from "appwrite";
import conf from "../config/conf";

export class Services {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // Create Post
  async createPost({ title, content, slug, featuredImage, status, userId }) {
    try {
      if (!slug || typeof slug !== "string") {
        throw new Error("Invalid slug: Appwrite document ID is required.");
      }

      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      );
    } catch (error) {
      console.log("createPost error:", error);
      return false;
    }
  }

  // update post
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.log("updatePost error:", error);
      return false;
    }
  }

  // delete post
  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("deletePost error:", error);
      return false;
    }
  }

  // get Post
  async getPost(slug) {
    try {
      return await this.database.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.log("getPost error:", error);
      return false;
    }
  }

  // list post
  async listPosts(queries = [Query.equal("status", "active")]) {
    try {
      return this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.log("getPosts error:", error);
      return false;
    }
  }

  // Storage services

  // upload file
  async uploadFile(file) {
    try {
      return this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.log("uploadFile error:", error);
      return false;
    }
  }

  //get file preview
  getFilePreview(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId).toString();
  }

  //delete file
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("deleteFile error:", error);
      return false;
    }
  }
}

const services = new Services();
export default services;
