import { ID } from "appwrite";
import { storage } from "./appwrite";

export const upload = async (file) => {
  try {
    const response = await storage.createFile(
      import.meta.env.VITE_APPWRITE_BUCKETID,
      ID.unique(),
      file
    );

    const imgUrl = storage.getFilePreview(
      import.meta.env.VITE_APPWRITE_BUCKETID,
      response.$id
    );

    return imgUrl;
  } catch (error) {
    console.error("Something went wrong", error);
  }
};
