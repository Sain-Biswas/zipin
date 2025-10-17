import { z } from "zod";

export const createNewFolderSchema = z.object({
  name: z.string({
    error: "A folder name is required to create a new folder."
  }),
  isUTM: z.boolean({ error: "This flag is required for folder creation." }),
  isSourceEnabled: z
    .boolean({ error: "This flag is required when UTM is enabled." })
    .default(false),
  isMediumEnabled: z
    .boolean({ error: "This flag is required when UTM is enabled." })
    .default(false),
  isCampaignEnabled: z
    .boolean({ error: "This flag is required when UTM is enabled." })
    .default(false),
  isTermEnabled: z
    .boolean({ error: "This flag is required when UTM is enabled." })
    .default(false),
  isContentEnabled: z
    .boolean({ error: "This flag is required when UTM is enabled." })
    .default(false)
});

export const nameSchema = z.object({
  name: z.string({ error: "A name is requires to process this request." })
});

export const createNewLinkSchema = z
  .object({
    id: z.string({
      error:
        "A short id is required to map this link. Please generate one using the provided form options."
    }),
    originalUrl: z.url({
      error: "The original URL is required to create a new link."
    }),
    description: z.string({ error: "A description is required for the link." }),
    folderId: z
      .uuid({ error: "A folder reference is needed or it must be null." })
      .nullable(),
    tags: z.array(z.uuid({ error: "Tag array can only be strings." })),
    expiresOn: z
      .date({ error: "Expiration date must be a valid date object." })
      .nullable(),
    utm: z
      .object({
        source: z.string().nullable(),
        medium: z.string().nullable(),
        campaign: z.string().nullable(),
        term: z.string().nullable(),
        content: z.string().nullable()
      })
      .nullable()
  })
  .superRefine((data, ctx) => {
    if (data.utm !== null) {
      const { campaign, content, medium, source, term } = data.utm;

      if ([campaign, content, medium, source, term].every((v) => v === null)) {
        ctx.addIssue({
          code: "custom",
          message:
            "If UTM object is provided, at least one UTM field must be non-null",
          path: ["utm"]
        });
      }
    }
  });
