import z from "zod";


export const UrlSchema = z.object({
  url:z.string()
    .url("Please enter a valid URL (including http:// or https://)"),
})