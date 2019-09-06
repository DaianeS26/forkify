// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as SearchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';


// global state of the app
// search object
// current recipe
// shopping list object
// liked recipes

const state = {};


// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) Get query from view
    const query = SearchView.getInput();
    console.log(query);

    if (query){
        //New search object and add to state
        state.search = new Search(query);

        //UI for results
        SearchView.clearInput();
        SearchView.clearResults();
        renderLoader(elements.searchRes);


        //Search for recipes
        await state.search.getResults();

        //Render results on the UI
        clearLoader();
        SearchView.renderResults(state.search.result);
    }
}

//event handler
elements.searchForm.addEventListener('submit', e => { 
    e.preventDefault();
    controlSearch();

});

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
    const id = window.location.hash.replace('#', ' ');
    console.log(id);

    if(id) {
     // prepare the UI for changes 


     //Create new recipe object
        state.recipe = new Recipe(id);

     //Get recipes data
        await state.recipe.getRecipe();
    
     //Calculate servings and cooking time
      state.recipe.calcTime();
      state.recipe.calcServings();

     //Render recipe

     console.log(state.recipe);


    }
}

window.addEventListener('hashchange',controlRecipe);



