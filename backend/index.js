const express = require("express");
const connectDB = require("./configs/connectDB");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errors");
require("dotenv").config();

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Pofile project 😊",
  });
});
app.use("/auth", require("./routes/auth"));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Listen for port to run server
const PORT = process.env.PORT || 1818;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
