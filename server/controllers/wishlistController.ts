import { Request, Response } from "express";
import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "items",
      "name price images"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: wishlist });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// POST /api/wishlist/:productId  (Toggle)
export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    //Safety check
    if (!productId || Array.isArray(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const exists = wishlist.items.find(
      (item) => item.toString() === productId
    );

    if (exists) {
      // REMOVE
      wishlist.items = wishlist.items.filter(
        (item) => item.toString() !== productId
      );
    } else {
      // ADD (FIXED ObjectId issue)
      const objectId = new mongoose.Types.ObjectId(productId);
      wishlist.items.push(objectId);
    }

    await wishlist.save();
    await wishlist.populate("items", "name price images");

    res.json({ success: true, data: wishlist });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId || Array.isArray(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("items", "name price images");

    res.json({ success: true, data: wishlist });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};