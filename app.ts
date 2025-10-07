import express from "express";
import dotenv from "dotenv";

import { AppDataSource } from "./src/dataSource";
import userRoutes from "./src/routes/users";
import register from "./src/metrics";

dotenv.config();

const app = express();
app.use(express.json());

//Routes
app.use("/api", userRoutes);

//prometheus metrics endpoint

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
