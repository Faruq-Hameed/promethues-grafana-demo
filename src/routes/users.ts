import express from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../dataSource";
import {
  httpRequestCount,
  httpRequestDuration,
  dbQueryDuration,
  dbQueryCounter,
  numOfUsers,
} from "../metrics";

const router = express.Router();

router.post("/users", async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const userRepository = AppDataSource.getRepository(User);
    if(!req.body.name || !req.body.email){
        throw new Error("Name and email are required");
    }
    const user = userRepository.create({
      name: req.body.name,
      email: req.body.email,
    });
    await userRepository.save(user);
    dbQueryDuration.inc({ success: "true" });
    console.log("User saved:", user);

    numOfUsers.inc(1); // Increment the gauge by 1
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    httpRequestCount.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    res.json(user);
  } catch (error) {
    dbQueryDuration.inc({ success: "false" });
    end({
      method: req.method,
      route: req.route?.path || "",
      status_code: res.statusCode,
    });
    httpRequestCount.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  }
});

router.get("/users", async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    dbQueryCounter.inc({ success: "true" });

    numOfUsers.set(users.length);
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    httpRequestCount.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    res.json(users);
  } catch (error) {
    dbQueryDuration.inc({ success: "false" });
    end({
      method: req.method,
      route: req.route?.path || "",
      status_code: res.statusCode,
    });
    httpRequestCount.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  }
});

export default router;
