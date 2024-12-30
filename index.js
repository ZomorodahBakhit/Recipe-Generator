import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();


// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const port = process.env.PORT;
const API_URL = "https://api.spoonacular.com/recipes/";
const API_KEY = process.env.API_KEY;

const PEXELS_API_URL = "https://api.pexels.com/v1/search";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const file = "main-test.ejs";

// Configuration objects
const config = {
  params: {
    apiKey: API_KEY,
    ingredients: "shrimp, oil, tomato, pasta",
    number: 11,
  },
};

const defaultConfig = {
  params: {
    apiKey: API_KEY,
    number: 2,
  },
};



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






async function fetchPexelsImage(recipeTitle) {
  
  try {
    const response = await axios.get(PEXELS_API_URL, {
      params: {
        query: "food recipe:" + recipeTitle,
        orientation: "landscape", // Search by recipe title
        per_page: 1,        // Only fetch the first result
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const photo = response.data.photos[0];
    if (photo) {
      return {
        imageUrl: photo.src.large,               // Medium-sized image URL

        
        sourceUrl: photo.url,                     // Link to the image on Pexels
      };
    } else {
      return {
        imageUrl: "/img/recipe1.png", // Default image if no match found
        
        sourceUrl: "#",
      };
    }
  } catch (error) {
    console.error(`Error fetching image for ${recipeTitle}:`, error.message);
    return {
      imageUrl: "/img/recipe1.png",
      
      sourceUrl: "#",
    };
  }
}


app.get("/generate", async (req, res) => {
  const { selectedIngredients } = req.body;
  console.log('Received ingredients:', selectedIngredients);

  // Process the ingredients (e.g., save to a database)
  if (selectedIngredients && selectedIngredients.length > 0) {
      res.status(200).send({ message: 'Ingredients received successfully', ingredients: selectedIngredients });
  } else {
      res.status(400).send({ message: 'No ingredients provided' });
  }
});




app.post("/generate", async (req, res) => {
  try {
    // Fetch recipes using the external API

    const { selectedIngredients } = req.body;


    const result = await axios.get(`${API_URL}findByIngredients`, {
      params: {
        apiKey: API_KEY,
        ingredients: selectedIngredients,
        number: 11,
      },
    });

    const recipes = result.data; // Array of recipes

    // Enrich recipes with image details from Pexels
    const enrichedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const imageDetails = await fetchPexelsImage(recipe.title); // Fetch image details
        return {
          ...recipe,
          ...imageDetails, // Add image details to the recipe object
        };
      })
    );

    // Save enriched recipes to data.json
    fs.writeFileSync("data.json", JSON.stringify(enrichedRecipes, null, 2), "utf-8");
    console.log("Enriched recipes have been saved to data.json");

    // Pagination setup
    const recipesPerPage = 10; // Number of recipes per page
    const page = parseInt(req.query.page) || 1; // Current page (default to 1)
    const { recipesOnPage, totalPages } = paginateData(enrichedRecipes, page, recipesPerPage);

    // Render the main-test-test.ejs template
    res.render(file, {
      content: recipesOnPage, // Recipes to display on the current page
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching or processing recipes:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});




// Routes
app.get("/", async (req, res) => {
  try {
    // Fetch random recipes from the API
    const result = await axios.get(`${API_URL}random`, defaultConfig);
    const recipes = result.data.recipes;

    // Enrich recipes with image details from Pexels
    const enrichedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const imageDetails = await fetchPexelsImage(recipe.title); // Fetch image details
        return {
          ...recipe,
          ...imageDetails, // Add image details to the recipe object
        };
      })
    );

    // Save enriched recipes to data.json
    saveDataToFile("data.json", enrichedRecipes);
    console.log("Enriched recipes have been saved to data.json");

    // Pagination setup
    const recipesPerPage = 10; // Number of recipes per page
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const { recipesOnPage, totalPages } = paginateData(enrichedRecipes, page, recipesPerPage);

    // Render the main-test.ejs template
    res.render(file, {
      content: recipesOnPage, // Recipes to display on the current page
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching or processing recipes:", error.message);
    res.status(500).send("An error occurred while fetching random recipes.");
  }
});




// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
