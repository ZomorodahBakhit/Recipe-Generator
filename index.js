import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  res.render("main-test.ejs");
});

app.listen(port, () => {
  console.log(`Server running on ${port}.`);
});
