// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as SearchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView'
import {elements, renderLoader, clearLoader} from './views/base';
import List from './models/List';



// global state of the app
// search object
// current recipe
// shopping list object
// liked recipes

const state = {};
window.state = state;


// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) Get query from view
    const query = SearchView.getInput();

    //for testing
    // const query = 'pizza';
    console.log(query);

    if (query){
        //New search object and add to state
        state.search = new Search(query);

        //UI for results
        SearchView.clearInput();
        SearchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //Search for recipes
            await state.search.getResults();

            //Render results on the UI
            clearLoader();
            SearchView.renderResults(state.search.result);
        } catch(error){
            alert('Something went wrong!');
            clearLoader();
        }
    }
}

// event handler
elements.searchForm.addEventListener('submit', e => { 
    e.preventDefault();
    controlSearch();

});

//TESTING
// window.addEventListener('load', e => { 
//     e.preventDefault();
//     controlSearch();

// });

//event delegation
//closest method
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result, goToPage);
        
    }
})


// RECIPE CONTROLLER

const controlRecipe = async () => {
    //Get id from url 
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
     // prepare the UI for changes 
       recipeView.clearRecipe();
       renderLoader(elements.recipe);


    //Highlight selected search item
        
    if(state.search){
        SearchView.highLightSelected(id);
    }


     //Create new recipe object
        state.recipe = new Recipe(id);

        //testing
        // window.r = state.recipe;


        try{
            //Get recipes data and parse ingredients. Returns promise
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
        
            //Calculate servings and cooking time
            state.recipe.calcTime();
            state.recipe.calcServings();
        
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        
            // console.log(state.recipe);
        } catch(error){
            alert('Error processing recipe!');

        }
    


    }
};


//LIST CONTROLLER 

const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add ingredients to the list and user interface

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

}

//Add different event listeners to the same element
//Create array

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load', controlRecipe);

//Handle delete and update list item events
elements.shopping.addEventListener('click', e =>{
    //retrieve id from closest element
    const id = e.target.closest('.shoppig__item').dataset.itemid;

    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }

})




//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, recipe__btn--add *')){
        controlList();
    }

    // console.log(state.recipe);
});

window.l = new List();