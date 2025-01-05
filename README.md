
# Recipe-Generator  
### YUMnTUM

**YUMnTUM** is a platform designed to make cooking easier and more enjoyable. Enter the number of ingredients you want to use and their names, and we’ll generate recipes tailored to your preferences. Perfect for beginners and experienced cooks alike!  

---

## Features  
- Generate recipes based on selected ingredients.  
- Recipe instructions sourced from the Spoonacular API.  
- Beautiful recipe images fetched using the Pexels API.  
- Responsive and user-friendly design.  
- Future plans to add more features and enhance the user experience.  

---

## Prerequisites  
Before running the project, ensure you have the following installed on your system:  
1. [Node.js](https://nodejs.org/)  
2. [npm](https://www.npmjs.com/) (comes with Node.js)  

---

## Setting Up the Project  

Follow these steps to clone the repository and run the project locally:  

### 1. Clone the Repository  
```bash  
git clone https://github.com/your-username/recipe-generator.git  
cd recipe-generator  
```  

### 2. Install Dependencies  
Install the required dependencies using `npm`:  
```bash  
npm install  
```  

### 3. Set Up Environment Variables  
1. Copy the example `.env.example` file to `.env`:  
   ```bash  
   cp .env.example .env  
   ```  
2. Open the `.env` file and add your API keys:  
   ```env  
   API_KEY=your_spoonacular_api_key  
   PEXELS_API_KEY=your_pexels_api_key  
   PORT=3000  # You can change this port if needed  
   ```  

### 4. Start the Application  
Run the following command to start the server:  
```bash  
npx nodemon index.js
```  

---

## Viewing the Application  

1. Open your browser.  
2. Navigate to `http://localhost:3000`.  
3. Follow the instructions on the homepage to generate recipes using your chosen ingredients.  

---

## Troubleshooting  

1. **API Key Issues**:  
   - Ensure your API keys are valid and properly added to the `.env` file.  
   - Refer to the Spoonacular API and Pexels API documentation for more details on obtaining keys.  

2. **Port Conflicts**:  
   - If port `3000` is already in use, update the `PORT` value in the `.env` file to a different number (e.g., `4000`).  
   - Restart the application with the new port.  

3. **Missing Dependencies**:  
   - If you encounter errors during `npm install`, try clearing the cache and re-installing:  
     ```bash  
     npm cache clean --force  
     npm install  
     ```  

---

## Technologies Used  

- **Node.js**: Backend server.  
- **Express.js**: Routing and server-side logic.  
- **Spoonacular API**: Fetching recipes and instructions.  
- **Pexels API**: Fetching recipe images.  

---

## Future Plans  

- Add user authentication for saving favorite recipes.  
- Enable filtering recipes by dietary preferences (e.g., vegan, gluten-free).  
- Enhance the design for better mobile responsiveness.  
- Include detailed nutritional information for each recipe.  

---

Feel free to reach out if you encounter any issues or have suggestions for improvement! 😊 

``` 

