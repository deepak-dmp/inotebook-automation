const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const JWT_SECRET="Deepakisagoodb$oy";
//create a user using : POST "api/auth/createuser". Doesn't reqiure Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Entar a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are errors, retuurn bad request  and the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{

   

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "a user wih the email already exist" });
    }
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password:secPass ,
    })
    const data={
      user:{
        id: user.id
      }
    }
    const authtoken= jwt.sign(data, JWT_SECRET);
    console.log(authtoken)
    res.json({authtoken})
      }
    catch(error){
      console.error(error.message);
      res.status(500).send("soem error occured")
    }
  }
);

module.exports = router;
