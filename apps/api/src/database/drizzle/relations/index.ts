import { defineRelationsPart } from "drizzle-orm";
import * as schema from "../schemas/index.js";
import { sessionRelations } from "./sessions.relations.js";
import { businessRelations } from "./business.relations.js";

const mainRelations = defineRelationsPart(schema);

export const relations = {
  ...mainRelations,
  ...sessionRelations,
  ...businessRelations,
};
