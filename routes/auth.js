const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const featchuser=require("../middleware/featchuser")

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
    let success=false
    //if there are errors, retuurn bad request  and the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try{

   

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "a user wih the email already exist" });
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
    success = true
    console.log(authtoken)
    res.json({success,authtoken})
      }
    catch(error){
      console.error(error.message);
      res.status(500).send( success,"Internal server error")
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Entar a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success=false;
    
    //if there are errors, return bad request  and the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        return res.status(400).json({ success, error:"Please try to login with correct credentials"})
      }

      const passwordCompare =await bcrypt.compare(password,user.password);
      if(!passwordCompare){
         return res.status(400).json({ success,error:"Please try to login with correct credentials"})
      }
      
      const data={
      user:{
        id: user.id
      }
    }
    const authtoken= jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({success,authtoken})
    console.log(authtoken)

    } catch (error) {
      console.error(error.message);
      res.status(500).send( success,"Internal server error")
    }
  })
//Route3: Get loggedin User details using: Post "/api/auth/getuser" . Login required

router.post("/getuser",featchuser,async (req, res) => {

  try {
    userId =req.user.id;
    const user= await User.findById(userId).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal server error')
    
  }


})

module.exports = router;
