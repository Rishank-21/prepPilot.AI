import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/inputs/Input";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;
    if (!role.trim() || experience === "" || Number(experience) < 0 || !topicsToFocus.trim()) {
      setError("Enter a role, topics, and zero or more years of experience.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const generateQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generateQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
        toast.success("Session created successfully!");
      } else {
        setError("The server didn’t return a session. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create session");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col justify-center">
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Fill out a few quick details and unlock your personalized set of
        interview questions!
      </p>
      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target role"
          placeholder="(e.g. ,Frontend Developer , UI/UX Designer , etc.)"
          type="text"
        />
        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="(e.g. 1 year , 2 years , 10+ years)"
          type="number"
        />
        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to Focus"
          placeholder="(e.g. React , Node.js , etc.)"
          type="text"
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description (optional)"
          placeholder="(e.g. Briefly describe your experience)"
          type="text"
        />

        {error && <p role="alert" className="text-red-700 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2 relative flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading && (
            <span className="inline-flex items-center">
              <SpinnerLoader />
            </span>
          )}
          <span>{isLoading ? "Creating Session..." : "Create Session"}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
