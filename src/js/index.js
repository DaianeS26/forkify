// Global app controller

import Search from './models/Search';
import * as SearchView from './views/searchView';
import {elements} from './views/base';


// global state of the app
// search object
// current recipe
// shopping list object
// liked recipes

const state = {};

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

        //Search for recipes
        await state.search.getResults();

        //Render results on the UI
        SearchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => { 
    e.preventDefault();
    controlSearch();

});


