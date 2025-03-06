import express from "express";
import { prisma } from "db/client";
import cors from "cors";
import { authMiddleware } from "./middleware";
const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

app.post("/project", authMiddleware, async (req, res) => {
  console.log(req.body);
  const userId = req.userId!;
  const { prompt } = req.body;
  const description = prompt.split("\n")[0];
  const project = await prisma.project.create({
    data: {
      description,
      userId: userId,
    },
  });
  res.json({
    projectId: project.id,
  });
});

app.get("/projects", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const project = await prisma.project.findFirst({
    where: {
      userId,
    },
  });

  res.json(project);
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
