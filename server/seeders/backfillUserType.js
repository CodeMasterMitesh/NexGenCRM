import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../config/schema.js";

dotenv.config();

const backfillUserType = async () => {
  try {
    await connectDB();

    const filter = {
      $or: [{ type: { $exists: false } }, { type: null }, { type: "" }],
    };

    const result = await User.updateMany(filter, { $set: { type: "users" } });

    console.log(
      `Backfill complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

backfillUserType();
