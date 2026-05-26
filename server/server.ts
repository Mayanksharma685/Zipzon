import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import connectDB from "./config/db.js";
import { clerkWebhook } from "./controllers/webhooks.js";
import AddressRouter from "./routes/addressRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/orderRoutes.js";
import ProductRouter from "./routes/productsRoutes.js";
import WishlistRouter from "./routes/wishlistRoutes.js";

const app = express();

// CORS Configuration
app.use(cors({ origin: true, credentials: true }));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(clerkMiddleware());

// Connect to DB
connectDB().catch(err => console.error("Error:", err.message));

// Webhooks
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

// Routes
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/addresses", AddressRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/wishlist", WishlistRouter);

const port = process.env.PORT || 3000;

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

export default app;
