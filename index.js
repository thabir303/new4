require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/signup");
const authRoutes = require("./routes/login");
const passwordResetRoutes = require("./routes/passwordReset");
const addUser = require("./routes/addUser");
const rbacRoutes = require("./routes/rbac");
const vehicleRoutes = require("./routes/dataEntry");
const stsRoutes = require('./routes/sts');
const landfillRoutes = require('./routes/landfill');
const distanceRoutes = require('./routes/distance');
const billRoutes = require('./routes/bill');
const fleetOptimizationRoutes = require('./routes/fleetOptimization');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connection();

// Routes
app.use("/admin", userRoutes);
app.use("/auth/login", authRoutes);
app.use("/auth", passwordResetRoutes); 
app.use("/users", addUser);
app.use("/rbac", rbacRoutes);
app.use("/vehicles", vehicleRoutes);
app.use('/api/sts', stsRoutes);
app.use('/api/landfill', landfillRoutes);
app.use('/api/distance', distanceRoutes);
app.use('/api/bills',billRoutes);
app.use('/optimize-fleet', fleetOptimizationRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
