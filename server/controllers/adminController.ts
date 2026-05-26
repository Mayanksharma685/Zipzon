import { Request, Response } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Get dashboard stats
// GET /api/admin/stats

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    console.log("[Admin] Fetching dashboard stats...");

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const validOrders = await Order.find({ orderStatus: { $ne: "cancelled" } });
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    console.log("[Admin] Stats calculated:", {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrdersCount: recentOrders.length,
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error("[Admin] Error fetching stats:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error.message 
    });
  }
};