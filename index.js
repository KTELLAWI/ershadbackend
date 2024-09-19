const express = require("express");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const jobRoutes = require("./routes/jobRoute");
const applicationRoutes = require("./routes/applicationRoute");
const JoinFreelancer = require("./routes/joinFreelancerRoute");
const contactRoute = require("./routes/contactRoute");
connectDB();
const port = process.env.PORT || 5050;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/work", JoinFreelancer);
app.use("/api/contact", contactRoute);
//statics
app.use("/userImages", express.static("userImages"));
app.use("/exports", express.static("exports"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
