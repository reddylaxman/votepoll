import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePoll.css";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    } else {
      alert("Maximum 6 options allowed.");
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert("A poll must have at least 2 options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedOptions = options
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");

    if (!question.trim() || trimmedOptions.length < 2) {
      alert("Please enter a question and at least two valid options.");
      return;
    }

    const voterId = localStorage.getItem("voterId");
    if (!voterId) {
      alert("You must be logged in to create a poll.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3133/polls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          options: trimmedOptions.map((text) => ({ text, votes: 0 })),
          createdBy: voterId,
        }),
      });

      if (response.ok) {
        alert("Poll created successfully!");
        navigate("/polls");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error creating poll.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the poll.");
    }
  };

  return (
    <div className="poll-container">
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((option, index) => (
          <div key={index} className="option-group">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            {options.length > 2 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeOption(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button type="button" className="add-option" onClick={addOption}>
            ➕ Add Option
          </button>
        )}
        <button type="submit" className="submit-btn">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
