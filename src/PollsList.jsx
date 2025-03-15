import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PollsList.css";

const PollsList = () => {
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const voterId = localStorage.getItem("voterId");

  useEffect(() => {
    fetchPolls();
    loadVotedPolls();
  }, []);

  const loadVotedPolls = () => {
    const storedVotes = JSON.parse(localStorage.getItem("votedPolls")) || [];
    setVotedPolls(storedVotes);
  };

  const fetchPolls = async () => {
    try {
      const response = await fetch("http://localhost:3133/polls/");
      const data = await response.json();
      console.log("Fetched Polls:", data);
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const handleVote = async (pollId) => {
    if (!voterId) {
      alert("You must be logged in to vote.");
      navigate("/login");
      return;
    }

    if (votedPolls.includes(pollId)) {
      alert("You have already voted in this poll.");
      return;
    }

    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) {
      alert("Please select an option before submitting your vote.");
      return;
    }

    try {
      console.log("Submitting vote:", { voterId, pollId, selectedOption });

      const response = await fetch("http://localhost:3133/votes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voterId, pollId, option: selectedOption }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Vote submitted successfully!");
        const updatedVotedPolls = [...votedPolls, pollId];
        setVotedPolls(updatedVotedPolls);
        localStorage.setItem("votedPolls", JSON.stringify(updatedVotedPolls));
        fetchPolls();
      } else {
        alert(`Error submitting vote: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleOptionChange = (pollId, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: option,
    });
  };

  const handleDeletePoll = async (pollId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poll?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3133/polls/${pollId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Poll deleted successfully!");
        fetchPolls();
      } else {
        alert("Error deleting poll.");
      }
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const handleUpdatePoll = (pollId) => {
    navigate(`/updatePoll/${pollId}`);
  };

  console.log("Voter ID:", voterId);
  console.log("All Polls:", polls);

  const filteredPolls =
    activeTab === "myPolls"
      ? polls.filter((poll) => poll.createdBy?.toString() === voterId)
      : polls;

  return (
    <div className="polls-container">
      <button
        className="create-poll-btn"
        onClick={() => navigate("/createPoll")}
      >
        Create Poll
      </button>

      <div className="poll-tabs">
        <button
          className={activeTab === "all" ? "active-tab" : ""}
          onClick={() => setActiveTab("all")}
        >
          All Polls
        </button>
        <button
          className={activeTab === "myPolls" ? "active-tab" : ""}
          onClick={() => setActiveTab("myPolls")}
        >
          My Polls
        </button>
      </div>

      <h2>{activeTab === "myPolls" ? "My Polls" : "Available Polls"}</h2>
      {filteredPolls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        filteredPolls.map((poll) => (
          <div key={poll._id} className="poll-card">
            <h3>{poll.question}</h3>

            {poll.options.map((option, index) => (
              <label key={index} className="poll-option">
                <input
                  type="radio"
                  name={`poll-${poll._id}`}
                  value={option.text}
                  checked={selectedOptions[poll._id] === option.text}
                  onChange={() => handleOptionChange(poll._id, option.text)}
                  disabled={votedPolls.includes(poll._id)}
                />
                {option.text} ({option.votes} votes)
              </label>
            ))}

            <button
              className="submit-vote-btn"
              onClick={() => handleVote(poll._id)}
              disabled={votedPolls.includes(poll._id)}
            >
              {votedPolls.includes(poll._id) ? "Voted" : "Submit Vote"}
            </button>

            {activeTab === "myPolls" && (
              <div className="poll-actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdatePoll(poll._id)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePoll(poll._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PollsList;
