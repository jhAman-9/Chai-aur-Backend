const express = require("express");
const router = express.Router();

const MenuItem = require("../models/Menu.js");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);
    const saveMenuItem = await newMenuItem.save();
    console.log("Menu Item Save", saveMenuItem);
    res.status(200).json(saveMenuItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("Menu data Fetched Successfully");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Error While Fetching the of menu" });
  }
});

router.get(`/:tasteType`, async (req, res) => {
  try {
    const tasteType = req.params.tasteType;

    if (
      tasteType === "sweet" ||
      tasteType === "sour" ||
      tasteType === "spicy"
    ) {
      const data = await MenuItem.find({ taste: tasteType });

      console.log(`Response fetched SuccessFully for ${tasteType}`);

      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Put and Delete Operation for Menu Items

router.put(`/:_id`, async (req, res) => {
  try {
    const menuItemId = req.params._id;

    const allMenuItems = req.body;

    const UpdatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      allMenuItems,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!UpdatedMenuItem) {
      return res.status(404).json({ error: "MenuItems Not Found" });
    }

    console.log("MenuItem Updated", UpdatedMenuItem);

    res.status(200).json(UpdatedMenuItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error While Updating" });
  }
});

router.delete(`/:_id`, async (req, res) => {
  try {
    const menuItemId = req.params._id;

    const menuItemAfterDeleting = await MenuItem.findByIdAndDelete(menuItemId);

    if (!menuItemAfterDeleting) {
      console.log("MenuItem Did Not Found");
      res.status(404).json({ error: "MenuItem Did not Found" });
    }

    res.status(200).json(menuItemAfterDeleting);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
