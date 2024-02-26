import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from '@clerk/nextjs';

const f = createUploadthing();

const getUser = async () => await currentUser()
export const fileRouter = {
  image: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;