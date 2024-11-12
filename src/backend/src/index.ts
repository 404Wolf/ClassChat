import express from "express";
import cors from "cors";
import { createServer } from "http";
import ws from "ws";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./trpc/routers";

const app = express();
const httpServer = createServer(app);
const HTTP_PORT = 3000;
const WS_PORT = 3001;

// Middleware
app.use(cors());
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => ({ req }) as any,
  }),
);

// WebSocket Server
const wss = new ws.Server({
  port: WS_PORT,
  path: "/trpc",
});

const websocketHandler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: () => ({}) as any,
});

wss.on("connection", (ws) => {
  console.log(`WebSocket Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`WebSocket Connection (${wss.clients.size})`);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  websocketHandler.broadcastReconnectNotification();
  wss.close();
  httpServer.close();
});

// Start HTTP server
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`);
});

// Start WebSocket server
wss.on("listening", () => {
  console.log(
    `WebSocket Server is available at ws://localhost:${WS_PORT}/trpc`,
  );
});

export default app;
export type { AppRouter } from "./trpc/routers";
