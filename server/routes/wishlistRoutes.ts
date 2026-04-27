import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const WishlistRouter = express.Router();

// Get wishlist
WishlistRouter.get("/", protect, getWishlist);

// Add / Remove (toggle)
WishlistRouter.post("/:productId", protect, toggleWishlist);

// Remove specific
WishlistRouter.delete("/:productId", protect, removeFromWishlist);

export default WishlistRouter;