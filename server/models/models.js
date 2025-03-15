import mongoose from "mongoose";

const { Schema, model } = mongoose;

const VoterSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    votedPolls: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
  },
  { timestamps: true }
);

const PollSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "Voter" },
  },
  { timestamps: true }
);

const VoteSchema = new Schema(
  {
    voter: { type: Schema.Types.ObjectId, ref: "Voter", required: true },
    poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    option: { type: String, required: true },
  },
  { timestamps: true }
);

const Voter = model("Voter", VoterSchema);
const Poll = model("Poll", PollSchema);
const Vote = model("Vote", VoteSchema);

export { Voter, Poll, Vote };
