const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

// DB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("url");
    console.log(`Connected To Mongodb Database ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error ${error}`);
  }
};
connectDB();

// Schema
const sch = {
  name: String,
  email: String,
  id: Number,
};

const monmodel = mongoose.model("NewCol", sch);

// Counter table
const counterSchema = {
  id: {
    type: String,
  },
  seq: {
    type: Number,
  },
};

const countermodel = mongoose.model("counter", counterSchema);

app.post("/post", async (req, res) => {
  try {
    const auto = await countermodel.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { seq: 1 } },
      { new: true }
    );

    let seqId;

    if (auto == null) {
      const newval = await new countermodel({ id: "autoval", seq: 1 });
      newval.save();
      seqId = 1;
    } else {
      seqId = auto.seq;
      console.log(`New seq Id : ${seqId}`);
    }

    const data = new monmodel({
      name: req.body.name,
      email: req.body.email,
      id: seqId,
    });

    data.save();
    console.log(auto);
  } catch (error) {
    console.log(error);
  }

  res.send("Posted");
});

app.listen(3000, () => {
  console.log("On port 3000");
});
