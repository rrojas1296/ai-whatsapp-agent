import { defineRelations } from "drizzle-orm";
import * as schemas from "../schemas/index.js";

export const businessRelations = defineRelations(schemas, (r) => ({
  users: {
    business: r.many.business({
      from: r.users.id,
      to: r.business.ownerId,
    }),
  },
  business: {
    owner: r.one.users({
      from: r.business.ownerId,
      to: r.users.id,
      optional: false,
    }),
  },
}));
