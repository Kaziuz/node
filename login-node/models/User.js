const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
})

// nombre de la collection y el esquema
mongoose.model("users", userSchema)