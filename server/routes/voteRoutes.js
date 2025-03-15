import express from "express";
import { Vote, Poll, Voter } from "../models/models.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { voterId, pollId, option } = req.body;

    if (!voterId || !pollId || !option) {
      return res
        .status(400)
        .json({ message: "Missing voterId, pollId, or option" });
    }

    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const existingVote = await Vote.findOne({ voter: voterId, poll: pollId });
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "You have already voted in this poll" });
    }

    const optionIndex = poll.options.findIndex((opt) => opt.text === option);
    if (optionIndex === -1) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    const newVote = new Vote({ voter: voterId, poll: pollId, option });
    await newVote.save();

    res.status(201).json({ message: "Vote successfully cast", newVote });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
