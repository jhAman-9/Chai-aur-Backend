const express = require('express')
const router = express.Router(); 

const MenuItem = require('../models/Menu.js');


router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);
    const saveMenuItem = await newMenuItem.save();
    console.log("Menu Item Save", saveMenuItem);
    res.status(200).json(saveMenuItem);
  } catch (error) {
    console.log("Menu Item Save Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("Menu data Fetched Successfully");
    res.status(200).json(data);
  } catch (error) {
    console.log("Menu Data not fetch", error);
    res
      .status(500)
      .json({ error: "Internal Error While Fetching the of menu" });
  }
});

router.get(`/:tasteType`, async (req, res) => {
    try {
        const tasteType = req.params.tasteType;

        if (tasteType === 'sweet' || tasteType === 'sour' || tasteType === 'spicy') {
            const data = await MenuItem.find({ taste: tasteType });

            console.log(`Response fetched SuccessFully for ${tasteType}`);

            res.status(200).json(data)

        }
    } catch (error) {
        console.log("Taste data doesnot fetched", error);
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router