import express from "express";
import { Voter } from "../models/models.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingVoter = await Voter.findOne({ username });
    if (existingVoter) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newVoter = new Voter({ username, password });
    await newVoter.save();
    res.status(201).json({ message: "Registration successful", newVoter });
  } catch (error) {
    res.status(400).json({ error: "Error registering voter", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const voter = await Voter.findOne({ username });
    if (!voter) {
      return res.status(404).json({ error: "User not found" });
    }

    if (voter.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", voterId: voter._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

router.get("/", async (req, res) => {
  try {
    const voters = await Voter.find();
    res.status(200).json(voters);
  } catch (error) {
    res.status(400).json({ message: "Error fetching voters", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedVoter = await Voter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVoter)
      return res.status(404).json({ message: "Voter not found" });
    res.status(200).json(updatedVoter);
  } catch (error) {
    res.status(400).json({ message: "Error updating voter", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedVoter = await Voter.findByIdAndDelete(req.params.id);
    if (!deletedVoter)
      return res.status(404).json({ message: "Voter not found" });
    res.status(200).json({ message: "Voter deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting voter", error });
  }
});

export default router;
