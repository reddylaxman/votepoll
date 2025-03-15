import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import voterRoutes from "./routes/voterRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3133;

const votepoll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};
votepoll();

app.use(express.json());
app.use(cors());

app.use("/voters", voterRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.get("/", (req, res) => {
  res.send("Running votepoll server");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
