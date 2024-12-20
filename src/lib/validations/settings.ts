import * as z from "zod"

export const settingsSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  height: z.number().min(0, {
    message: "Height must be a positive number.",
  }).max(300, {
    message: "Height must be less than 300 cm.",
  }),
  weight: z.number().min(0, {
    message: "Weight must be a positive number.",
  }).max(500, {
    message: "Weight must be less than 500 kg.",
  }),
  notifications: z.object({
    email: z.boolean(),
    workout: z.boolean(),
    progress: z.boolean(),
  }),
  preferences: z.object({
    language: z.enum(["en", "es", "fr"]),
    units: z.enum(["metric", "imperial"]),
  }),
})
