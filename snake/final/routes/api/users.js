const express = require('express');
const router = express.Router();
const config = require('config');

const User = require('../../model/User');
// @route    POST api/users
// @desc     Update Outcome
// @access   Public
router.post('/', async (req, res) => {
  try {
    const { name, point } = req.body;
    user = new User({ name, point });
    await user.save();
    res.send(user);
  } catch (err) {
    console.error(err.message);
    errors.status(500).send('Server error');
  }
});

// @route    GET api/profile
// @desc     Get the best outcome
// @access   public

router.get('/', async (req, res) => {
  const user = await User.find(function(err, pers) {
    if (err) {
      return res.send(err);
    }
    return res.json(pers);
  })
    .sort({ point: -1 })
    .limit(1);
});

module.exports = router;
