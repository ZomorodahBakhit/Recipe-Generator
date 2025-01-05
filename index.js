import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express();


// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure, random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);
app.set("view engine", "ejs");

const port = process.env.PORT;
const API_URL = "https://api.spoonacular.com/recipes/";
const API_KEY = process.env.API_KEY;

const PEXELS_API_URL = "https://api.pexels.com/v1/search";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const file = "main.ejs";
const about_file="about.ejs";
const method_file = "method.ejs";
const recipes_file= "recipes.ejs";


const defaultConfig = {
  params: {
    apiKey: API_KEY,
    number: 25,
  },
};


const defaultConfigRecipes = {
  params: {
    apiKey: API_KEY,
    number: 50,
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
        per_page: 3,        // Only fetch the first result
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const photo = response.data.photos[2];
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
    // saveDataToFile("data.json", enrichedRecipes);
    // console.log("Enriched recipes have been saved to data.json");

    // Pagination setup
    const recipesPerPage = 6; // Number of recipes per page
    const page = parseInt(req.query.page, 6) || 1; // Default to page 1 if not specified
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



app.post('/getRecipe/:title', async (req, res) => {
  try {
    const recipeId = req.body.id;       // Extract ID from the form data
    const recipeTitle = req.body.title;


    

    const API_URL_Recipe = API_URL+`${recipeId}/information`


    const response = await axios.get(`${API_URL_Recipe}?apiKey=${API_KEY}`);
  
    const ingredients = response.data.extendedIngredients.map(
      (ingredient) => ingredient.original
    );

    let instructions = response.data.instructions; // General instructions
    const sourceUrl = response.data.sourceUrl; // Original source URL

    // If instructions are empty, substitute with source URL and a message
    if (!instructions || instructions.trim() === '') {
      instructions = `The instructions for this recipe are available on the original website: <a href="${sourceUrl}" target="_blank">${sourceUrl}</a>`;
    }

    


    res.render(method_file, {
      content: ingredients, // Array of ingredients
      instructions: instructions, // Recipe instructions
      recipeTitle, // Pass the recipe title for display
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});




app.get("/generate", async (req, res) => {
  try {
    const { page = 1 } = req.query; // Get the page number from the query string
    const recipesPerPage = 6;

    // Fetch the enriched recipes from a temporary storage or previous result
    const enrichedRecipes = req.session.enrichedRecipes || []; // Use session or other storage
    const { recipesOnPage, totalPages } = paginateData(enrichedRecipes, page, recipesPerPage);

    res.render(file, {
      content: recipesOnPage,
      currentPage: parseInt(page, 10),
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching paginated recipes:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});




app.post("/generate", async (req, res) => {
  try {
    const { selectedIngredients } = req.body;

    // Fetch recipes using the external API
    const result = await axios.get(`${API_URL}findByIngredients`, {
      params: {
        apiKey: API_KEY,
        ingredients: selectedIngredients,
        number: 25,
      },
    });

    const recipes = result.data; // Array of recipes

    // Enrich recipes with image details from Pexels
    const enrichedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const imageDetails = await fetchPexelsImage(recipe.title);
        return {
          ...recipe,
          ...imageDetails,
        };
      })
    );

    // Save the enriched recipes in a session or a temporary variable
    req.session.enrichedRecipes = enrichedRecipes;

    // Pagination setup
    const recipesPerPage = 6;
    const page = 1;
    const { recipesOnPage, totalPages } = paginateData(enrichedRecipes, page, recipesPerPage);

    res.render(file, {
      content: recipesOnPage,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error processing recipes:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});



app.get("/AboutUs", async (req, res) => {
  try {
   
    res.render(about_file);
  } catch (error) {
    console.error("Error fetching or processing recipes:", error.message);
    res.status(500).send("An error occurred while fetching random recipes.");
  }
});





app.get("/Recipes", async (req, res) => {
  try {
    // Fetch random recipes from the API
    const result = await axios.get(`${API_URL}random`,defaultConfigRecipes);
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

   

    // Pagination setup
    const recipesPerPage = 10; // Number of recipes per page
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const { recipesOnPage, totalPages } = paginateData(enrichedRecipes, page, recipesPerPage);

    // Render the main-test.ejs template
    res.render(recipes_file, {
      content: recipesOnPage, // Recipes to display on the current page
      currentPage: page,
      totalPages,
    });

    
  } catch (error) {
    console.error("Error fetching or processing recipes:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    res.status(500).send("An error occurred while fetching random recipes.");
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
