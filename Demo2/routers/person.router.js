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

router.put("/:_id", async (req, res) => {
  try {
    const personId = req.params._id;
    const allPersonData = req.body;

    const updatedPersonData = await person.findByIdAndUpdate(
      personId,
      allPersonData,
      {
        runValidators: true, // also check validators
        new: true, // Update data access
      }
    );

    if (!updatedPersonData) {
      return res.status(404).json({ error: "Person Data Not Found" });
    }

    res.status(200).json(updatedPersonData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const personId = req.params._id;

    // FindByIdAndRemove func use to remove data with id
    const personDataAfterDeleting = await person.findByIdAndDelete(personId);

    if (!personDataAfterDeleting) {
      return res.status(404).json({ error: "Person Data not found to Delete" });
    }

    res.status(200).json( {message : "Person Data Is Deleted Successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
