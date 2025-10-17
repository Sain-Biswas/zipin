import { z } from "zod";

export const folderSlugSchema = z.object({
  folderSlug: z.string({
    error: "Folder's normalized name is required to process this request."
  })
});
