const express = require("express");
const router = express.Router();

const person = require("../models/person");

router.get("/", async (req, res) => {
  try {
    const data = await person.find(); // body parser giving data
    console.log("Data Save ", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("Person Save Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const data = req.body; // body parser giving data
    const newPerson = new person(data);
    const SavePerson = await newPerson.save();
    console.log("Data Save ", SavePerson);
    res.status(200).json(SavePerson);
  } catch (error) {
    console.log("Person Save Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(`/:workType`, async (req, res) => {
  try {
    const workType = req.params.workType;

    // If parameter is out of syllabus or out of work
    if (
      workType === "chef" ||
      workType === "waiter" ||
      workType === "manager"
    ) {
      const response = await person.find({ work: workType });
      console.log(`Response Fetch SuccessFully for ${workType}`);
      res.status(200).json(response);
    }

    // if parameter is in range...
    else {
      res.status(404).json({ error: "Invalid Work Type" });
    }
  } catch (error) {
    console.log("Menu Data not fetch", error);
    res
      .status(500)
      .json({ error: "Internal Error While Fetching the of menu" });
  }
});

module.exports = router;