import express from "express";
import { Poll } from "../models/models.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, options, createdBy } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: "Poll must have a question and at least 2 options",
      });
    }

    if (!createdBy) {
      return res.status(400).json({
        message: "Poll must have a creator (createdBy field is required)",
      });
    }

    const newPoll = new Poll({
      question,
      options: options.map((option) => ({ text: option.text, votes: 0 })),
      createdBy,
    });

    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ message: "Error creating poll", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().select("-__v");
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching polls", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Error fetching poll", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { question, options } = req.body;

    const updatedPoll = await Poll.findByIdAndUpdate(
      req.params.id,
      { question, options },
      { new: true, runValidators: true }
    );

    if (!updatedPoll)
      return res.status(404).json({ message: "Poll not found" });

    res.status(200).json(updatedPoll);
  } catch (error) {
    res.status(500).json({ message: "Error updating poll", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPoll = await Poll.findByIdAndDelete(req.params.id);
    if (!deletedPoll)
      return res.status(404).json({ message: "Poll not found" });

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting poll", error });
  }
});

export default router;
