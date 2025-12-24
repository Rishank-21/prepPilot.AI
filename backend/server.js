const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const path = require('path');
const cors = require('cors');

const app = express();

const connectDB = require('./config/db');
connectDB();
app.use(cors({
  origin: [ process.env.PRODUCTION_URL , process.env.FRONTEND_URL ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);


app.use("/uploads",express.static(path.join(__dirname, 'uploads'), {}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});