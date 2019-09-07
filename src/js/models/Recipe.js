import  axios from 'axios';
import {key, proxy} from '../config';


export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // console.log(res)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error){
            console.log(error);
            alert('Something went wrong');
        }
    }
    
    //assuming it takes 15 minutes for each 3 ingredients
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];


        //New array for the customized ingredients list
        const newIngredients = this.ingredients.map(el => {
            //Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            //Remove parenthesis (replace with space)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            return ingredient;
            // Parse ingredients into count, unit and ingredient

        });

        this.ingredients = newIngredients;
    }

}

