import express from "express";
import { ENV } from "./config/env.js";
// import { initDB } from "./config/db.js";
// import rateLimiter from "./middleware/rateLimiter.js";

// import job from "./config/cron.js";


const app = express();

// if (process.env.NODE_ENV === "production") job.start();

// // middleware
// app.use(rateLimiter);
// app.use(express.json());

// our custom simple middleware
// app.use((req, res, next) => {
//   console.log("Hey we hit a req, the method is", req.method);
//   next();
// });

const PORT = ENV.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT)
  });
// });
