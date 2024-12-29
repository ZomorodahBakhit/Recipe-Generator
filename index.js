import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
const API_URL = "https://api.spoonacular.com/recipes/";
const API_KEY = process.env.API_KEY;

// Configuration objects
const config = {
  params: {
    apiKey: API_KEY,
    ingredients: "flour, apples, sugar",
    number: 11,
  },
};

const defaultConfig = {
  params: {
    apiKey: API_KEY,
    number: 2,
  },
};

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Utility function to save data to a file
const saveDataToFile = (fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data has been saved to ${fileName}`);
};

// Utility function for pagination
const paginateData = (data, page, recipesPerPage) => {
  const totalPages = Math.ceil(data.length / recipesPerPage);
  const startIndex = (page - 1) * recipesPerPage;
  const endIndex = page * recipesPerPage;
  const recipesOnPage = data.slice(startIndex, endIndex);

  return { recipesOnPage, totalPages };
};

// Routes
app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "random", defaultConfig);
    const data = result.data.recipes;

    saveDataToFile("data.json", data);

    const recipesPerPage = 10;
    const page = parseInt(req.query.page) || 1;
    const { recipesOnPage, totalPages } = paginateData(data, page, recipesPerPage);

    res.render("main-test.ejs", {
      content: recipesOnPage,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/submit", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "findByIngredients", config);
    const data = result.data;

    saveDataToFile("data.json", data);

    const recipesPerPage = 10;
    const page = parseInt(req.query.page) || 1;
    const { recipesOnPage, totalPages } = paginateData(data, page, recipesPerPage);

    res.render("main-test.ejs", {
      content: recipesOnPage,
      currentPage: page,
      totalPages,
    });

    console.log(data[0].title);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
