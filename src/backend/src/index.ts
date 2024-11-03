import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hono!"));

console.log("Server is running on port 3000");
export default {
  port: 3000,
  fetch: app.fetch,
};
