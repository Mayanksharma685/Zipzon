import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      console.log("[Admin] No ADMIN_EMAIL set");
      return;
    }

    const user = await User.findOneAndUpdate({ email }, { role: "admin" });
    if (user) {
      console.log("[Admin] Admin role assigned to:", email);
      await clerkClient.users.updateUserMetadata(user.clerkId as string, {
        publicMetadata: { role: "admin" },
      });
    }
  } catch (error: any) {
    console.warn("[Admin] Setup warning:", error.message);
    // Don't throw - let server continue
  }
};

export default makeAdmin;
