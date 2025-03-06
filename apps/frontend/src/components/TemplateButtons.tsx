import React from "react";
import { Button } from "./ui/button";

export const TemplateButtons = () => {
  return (
    <div className=" flex justify-center gap-4 m-4">
      <Button variant={"outline"}>Build a chess app</Button>
      <Button variant={"outline"}>Create a Todo App</Button>
      <Button variant={"outline"}>Create docs App</Button>
      <Button variant={"outline"}>Create a fitness Tracker</Button>
    </div>
  );
};
