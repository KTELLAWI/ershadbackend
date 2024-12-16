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

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors(
    {
      origin: ["https://dev.ershad-sa.com","https://ershad-sa.com", "https://literate-space-rotary-phone-94jqpx545rfp9pr-3000.app.github.dev", "http://localhost:3000", "http://18.153.95.90:3000", "http://tellawi.rest:3000", "https://tellawi.rest"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);


//app.use(
//  cors()
//   {
//   origin: "https://ershad-frontend.vercel.app",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
// }
//);


app.get('/', (req, res) => {

  res.send('welcome to Ershad App');
});

app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/work", JoinFreelancer);
app.use("/api/contact", contactRoute);
app.use("/api/application", applicationRoutes);
//statics
app.use("/userImages", express.static("userImages"));
app.use("/exports", express.static("exports"));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

