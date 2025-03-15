import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePoll = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState({ question: "", options: [] });

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`http://localhost:3133/polls/${pollId}`);
      const data = await response.json();
      setPoll(data);
    } catch (error) {
      console.error("Error fetching poll:", error);
    }
  };

  const handleQuestionChange = (e) => {
    setPoll({ ...poll, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...poll.options];
    updatedOptions[index].text = value;
    setPoll({ ...poll, options: updatedOptions });
  };

  const handleUpdatePoll = async () => {
    try {
      const response = await fetch(`http://localhost:3133/polls/${pollId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poll),
      });

      if (response.ok) {
        alert("Poll updated successfully!");
        navigate("/polls");
      } else {
        alert("Error updating poll.");
      }
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  };

  return (
    <div className="update-poll-container">
      <h2>Update Poll</h2>
      <label>Question:</label>
      <input
        type="text"
        value={poll.question}
        onChange={handleQuestionChange}
      />

      <label>Options:</label>
      {poll.options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option.text}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleUpdatePoll}>Update Poll</button>
    </div>
  );
};

export default UpdatePoll;
