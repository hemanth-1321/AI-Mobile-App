"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/lib/config";
export const Prompt = () => {
  const [prompt, setPrompt] = useState<string>();
  const { getToken } = useAuth();
  const handleGenerate = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${BACKEND_URL}/project`,
        {
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log("could not generate", error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Textarea
        className="border-2 border-gray-500 max-w-2xl rounded-md p-2"
        placeholder="Create a Todo Application"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
    </div>
  );
};
