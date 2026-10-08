import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(25),
});

export const chatWithSourov = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { replyAsSourov } = await import("./chatbot.server");
    try {
      const reply = await replyAsSourov(data.messages);
      return { reply };
    } catch (error) {
      console.error("chatbot error", error);
      return {
        reply:
          "Sorry, I couldn't answer that just now — please try again in a moment, or email me at sourov.hasan373e@gmail.com.",
      };
    }
  });
