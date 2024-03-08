const express = require("express");
const router = express.Router();

const MenuItem = require("./../Models/MenuItem");

router.post("/", async (req, res) => {
    try {
      const data = req.body; // assuming the request body contains the persons data
      //Create a new Person document using the Mongoose model
      const newMenuItem = new MenuItem(data);
  
      // save the new person to the database
      const response = await newMenuItem.save();
      console.log("Menu data saved");
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.get("/", async (req, res) => {
    try {
      const data = await MenuItem.find();
      console.log("Menu data fetched");
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;