import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;
const API_URL = "https://api.spoonacular.com/recipes/";
const API_Key ="c586af3e98ff4558bea350e823923db4";



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  res.render("main-test.ejs");
});

const config = {
    params: { 
        apiKey:API_Key,
        ingredients: "flour, apples, sugar",
        
        
    },
  };
  
app.get("/submit", async (req, res) => {
try {
    const result = await axios.get(API_URL + "findByIngredients", config);

    const data =result.data;


    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data has been saved to data.json');


    res.render("main-test.ejs", { content: data });

    console.log(data[0].title);










} catch (error) {
    res.status(404).send(error.message);
}
});




app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
