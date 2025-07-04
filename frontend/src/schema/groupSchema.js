import { z } from "zod";

export const GroupSchema = z.object({
  name: z.string("Enter a group name"),
  description: z.string("Enter a group description"),
});
