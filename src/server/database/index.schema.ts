export { accountSchema } from "~/server/database/schema/account.schema";
export { sessionSchema } from "~/server/database/schema/session.schema";
export { userSchema } from "~/server/database/schema/user.schema";
export { verificationSchema } from "~/server/database/schema/verification.schema";

export { clicksSchema } from "~/server/database/schema/clicks.schema";
export { tagsSchema } from "~/server/database/schema/tags.schema";
export {
  urlRelation,
  urlSchema,
  urlToTagsRelation,
  urlToTagsSchema
} from "~/server/database/schema/url.schema";
