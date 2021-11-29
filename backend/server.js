const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const newMessageModel = require("./models/newMessage");

// Express Server Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_KEYV2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected! Hooray!");
  } catch (error) {
    console.log("DB didn't connect");
  }
};

connectDb();

// Server Connection Status -
app.get("/", (req, res) => {
  res.status(200).send("Server is connected yo");
});

// Email login
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ACC,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Server Connection Status -
app.get("/", (req, res) => {
  res.status(200).send("Server is connected yo");
});

// FOR FINDING (BUT I NEED TO AMEND THE CODE)
// app.post("/new-message", async (req, res) => {
//   console.log(req.body);
//   // main(req.body).catch(console.error);

//   // NEW TEST START
//   mongoose.connect(process.env.DB_KEYV2);
//   newMessageModel.create(req.body, (err, result) => {
//     if (result) {
//       console.log(`New form submission saved to the database!! ID: ${result._id}`);
//       res.sendStatus(201);
//     } else {
//       console.log(err);
//       res.sendStatus(400).send(err);
//     }
//   });
//   // NEW TEST END

app.post("/new-message", (req, res) => {
  console.log(req.body);
  // main(req.body).catch(console.error);

  // NEW TEST START

  newMessageModel.create(req.body, (err, result) => {
    if (result) {
      console.log(`New form submission saved to the database!! ID: ${result._id}`);
      res.sendStatus(201);
    } else {
      console.log(err);
      res.sendStatus(400).send(err);
    }
    // mongoose.connection.close();
  });
  // NEW TEST END

  // async function main(formData) {
  //   const uri = process.env.DB_KEY;
  //   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  //   try {
  //     await client.connect();
  //     console.log("Database connection was successful!");
  //     await createQuote(client, formData);
  //     res.sendStatus(201);
  //   } catch (err) {
  //     console.log(err);
  //     res.sendStatus(400).send(err);
  //   } finally {
  //     await client.close();
  //   }
  // }

  // async function createQuote(client, newQuote) {
  //   const quotesCollection = await client
  //     .db("reubens-first-db")
  //     .collection("m6-email-submissions")
  //     .insertOne(newQuote);
  //   console.log(`New contact form submission! ID: ${quotesCollection.insertedId}`);
  // }
  // The email submission to send
  var mailOptions = {
    from: "reubens@missionreadyhq.com",
    to: "useyourtimewell@gmail.com",
    subject: req.body.subject,
    text: ` New message received from the Contact Us form\nFrom:${req.body.name} \nSender's email address: ${req.body.email}\nMessage: ${req.body.message}`,
    html: `<div
    style="
          padding: 10px;
      border: solid 2px #003fbc;
      border-radius: 5px;
      width: 800px;
    "
  >
    <img
      src="https://static.ivanti.com/sites/marketing/media/images/logos/customers-color/datacom-reverse-logo.png"
      width="150px"
    />
    <br />
    New message received via the
    <i>Contact Us</i>
    page.
    <br />
    <br />
    <strong>From:</strong>
    ${req.body.name}
    <br />
    <strong>Sender&#x27;s email address:</strong>
    ${req.body.email}
    <br />
    <strong>Message:</strong>
    ${req.body.message}
    <br />
  </div>
  `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send();
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send();
    }
  });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
