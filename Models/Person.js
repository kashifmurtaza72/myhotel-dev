const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  age: {
    type: "number",
  },
  work: {
    type: "string",
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  address: {
    type: "string",
  },
  salary: {
    type: "number",
    required: true,
  },
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

personSchema.pre("save", async function (next) {
  const person = this;
  if (!person.isModified("password")) return next();

  // Hash the password only if it has been modified (or is new)
  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(person.password, salt);

    //Override the plain password with the hashed one
    person.password = hashedPassword;
    next();
  } catch (err) {}
});

personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    //use bcrypt to comapre the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

// Create Person model
const Person = mongoose.model("Person", personSchema);
module.exports = Person;
