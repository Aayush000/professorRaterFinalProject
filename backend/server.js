//-------------------------------- Aayush did from [3 - 61] lines ------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
// insalling morgan for logging in console - npm install morgan
import morgan from "morgan";

// middleware
const app = express(); // initialize express
app.use(express.json()); // to parse the body of the request
app.use(cors()); // to allow cross-origin requests
dotenv.config(); // to use .env file
app.use(morgan("dev")); // to log the requests

const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbUrl = process.env.DB_URI; // get the db url from .env file
const PORT = process.env.PORT || 8080; // get the port from .env file

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

// Schema for feedback
let Schema = mongoose.Schema;
let feedbackSchema = new Schema(
  {
    content: { type: String },
  },
  { timestamps: true }
);

let feedbackModel = mongoose.model("feedback", feedbackSchema);

// Schema for best professors
let bestProfessorsSchema = new Schema(
  {
    content: { type: String },
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields

let bestProfessorsModel = mongoose.model(
  "bestProfessors",
  bestProfessorsSchema
);

//------------------------------------------------- Subrat did from [65 - 155] lines ----------------------------

// API endpoints - root endpoint
app.get("/", (req, res) => {
  res.send("Server is running ramro sanga!!!");
});

// API endpoints - feedback endpoint
// get all feedbacks
app.get("/api/v1/feedbacks", async (req, res) => {
  try {
    let feedbacks = await feedbackModel.find().sort("-createdAt");
    res.status(200).json({
      status: 200,
      data: feedbacks,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// add feedback
app.post("/api/v1/feedbacks", async (req, res) => {
  const inputFeedback = req.body;

  try {
    let feedback = new feedbackModel(inputFeedback);
    feedback = await feedback.save();
    res.status(200).json({
      status: 200,
      data: feedback,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// delete feedback
app.delete("/api/v1/feedbacks/:feedbackId", async (req, res) => {
  try {
    let feedback = await feedbackModel.findByIdAndRemove(req.params.feedbackId);
    if (feedback) {
      res.status(200).json({
        status: 200,
        message: "Feedback deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No Feedback found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// edit feedback
app.put("/api/v1/feedbacks/:feedbackId", async (req, res) => {
  try {
    let feedback = await feedbackModel.findByIdAndUpdate(
      req.params.feedbackId,
      req.body,
      { new: true }
    );
    if (feedback) {
      res.status(200).json({
        status: 200,
        message: "Feedback updated successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No Feedback found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// ---------------------------------- Aayush did from [158 - 249] lines -------------------------------------

// API endpoints - best professors endpoint
// get all best professors
app.get("/api/v1/bestProfessors", async (req, res) => {
  try {
    let bestProfessors = await bestProfessorsModel.find().sort("-createdAt");
    res.status(200).json({
      status: 200,
      data: bestProfessors,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// add best professor
app.post("/api/v1/bestProfessors", async (req, res) => {
  const inputBestProfessor = req.body;

  try {
    let bestProfessor = new bestProfessorsModel(inputBestProfessor);
    bestProfessor = await bestProfessor.save();
    res.status(200).json({
      status: 200,
      data: bestProfessor,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// delete best professor
app.delete("/api/v1/bestProfessors/:bestProfessorId", async (req, res) => {
  try {
    let bestProfessor = await bestProfessorsModel.findByIdAndRemove(
      req.params.bestProfessorId
    );
    if (bestProfessor) {
      res.status(200).json({
        status: 200,
        message: "Best Professor deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No Best Professor found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// edit best professor
app.put("/api/v1/bestProfessors/:bestProfessorId", async (req, res) => {
  try {
    let bestProfessor = await bestProfessorsModel.findByIdAndUpdate(
      req.params.bestProfessorId,
      req.body,
      { new: true }
    );
    if (bestProfessor) {
      res.status(200).json({
        status: 200,
        message: "Best Professor updated successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No Best Professor found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
