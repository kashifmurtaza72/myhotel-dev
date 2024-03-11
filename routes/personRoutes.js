const express = require("express");
const router = express.Router();
const Person = require("./../Models/Person");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");

//post route to add person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // assuming the request body contains the persons data
    //Create a new Person document using the Mongoose model
    const newPerson = new Person(data);

    // save the new person to the database
    const response = await newPerson.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// signin
router.post("/signin", async (req, res) => {
  try {
    //Extract username and password from req.body
    const { username, password } = req.body;

    // Find the user by username
    const user = await Person.findOne({ username: username });

    // if user does not exit or password does not match
    if (!user || (await !user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }
    // generate token
    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(payload);

    // return token as response
    res.json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal Server error" });
  }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res) => {
  try {
    const userData = req.user;
    console.log("user data:", userData);
    const userId = userData.id;
    const user = await Person.findById(userId);
    res.status(200).json(user);

  }catch (err) {
    res.status(401).json({error:'Internal Server Error'})
  }
} );

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      const userId = userData.id;
      const user = await Person.findById(userId);
      res.status(200).json({ user });
    } else {
      const data = await Person.find();
      console.log(req.user);
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType; // extract the work type from the URL parameter
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: "Invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract the id from the URL parameter
    const updatedPersonData = req.body; // updated data from the person

    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract the person's ID from the URL parameter
    //Assuming you have a Person model
    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data deleted");
    res.status(200).json({ message: "person deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
