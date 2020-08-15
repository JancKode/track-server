const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

//access Track model
const Track = mongoose.model("Track");

const router = express.Router();

//make sure user is authenticated/signed in
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  const id = req.user._id;

  const tracks = await Track.find({ userId: id });

  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;
  const id = req.user._id;
  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }
  try {
    const track = new Track({
        name,
        locations,
        userId: id,
      });
      await track.save();
    
      res.send({ track });
  }catch (err) {
    res.status(422).send({error: err.message})
  }
  
});

module.exports = router;
