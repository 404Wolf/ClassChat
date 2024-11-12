import { z } from "zod";
import { publicProcedure, router } from "..";
import { classes } from "../../db/schemas/classes";
import { chats } from "../../db/schemas/chats";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { db } from "../../db";
import { v4 as uuid } from "uuid";

const selectClassSchema = createSelectSchema(classes);
const selectChatSchema = createSelectSchema(chats);

const classWithChatsSchema = selectClassSchema.extend({
  chats: z.array(selectChatSchema).optional(),
});

export const classesRouter = router({
  getClass: publicProcedure
    .input(z.object({ uuid: z.string() }))
    .output(classWithChatsSchema.nullable())
    .query(async ({ input }) => {
      const result = await db
        .selectDistinct()
        .from(classes)
        .where(eq(classes.uuid, input.uuid))
        .leftJoin(chats, eq(chats.classId, classes.id))
        .execute();

      if (result.length === 0) return null;

      return result[0].classes;
    }),
  getExampleClass: publicProcedure.output(z.string().uuid()).query(async () => {
    const result = await db
      .insert(classes)
      .values({
        uuid: uuid(),
        name: "Example Class",
        isExample: true,
      })
      .returning({ uuid: classes.uuid })
      .execute();

    new Promise<void>((resolve) =>
      setTimeout(
        () => {
          db.delete(classes).where(eq(classes.uuid, result[0].uuid)).execute();
          resolve();
        },
        1000 * 10 * 60, // 10 minutes
      ),
    );

    return result[0].uuid;
  }),
  addClass: publicProcedure
    .input(
      classWithChatsSchema.omit({ id: true }).partial({
        uuid: true,
        members: true,
        description: true,
        chats: true,
      }),
    )
    .output(
      z.object({
        class: classWithChatsSchema.pick({ id: true, uuid: true, name: true }),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .insert(classes)
        .values({ ...input, uuid: input.uuid || uuid() })
        .returning({
          id: classes.id,
          uuid: classes.uuid,
          name: classes.name,
        })
        .execute();
      if (result.length === 0) throw new Error("Failed to add class");

      return { class: result[0] };
    }),
  removeClass: publicProcedure
    .input(selectClassSchema.pick({ id: true }))
    .output(classWithChatsSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .delete(classes)
        .where(eq(classes.id, input.id))
        .execute();
      return result[0];
    }),
});

export type ClassesRouter = typeof classesRouter;

export const schemas = {
  selectClass: selectClassSchema,
  selectChat: selectChatSchema,
  classWithChats: classWithChatsSchema,
} as const;
