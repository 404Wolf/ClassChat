import { createClient } from "redis";

const client = createClient({
  url: "redis://cache:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export default client;
