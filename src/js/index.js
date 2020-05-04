import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import {elements, displayLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { _ } from 'core-js';


/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 const state = {};

/**
 * Search Controller
 */
 const consoleSearch = async () => {
    // 1. Get the query from view
    const query = searchView.getInput();

    // 2. New Search object and add to state
    if (query) {
        state.search = new Search(query);

        // 3. Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        displayLoader(elements.searchRes);
        
        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results in UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert(error); //'Error getting result.')
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    consoleSearch();
});

elements.searchResPage.addEventListener('click', e => {
const button = e.target.closest('.btn-inline');
if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
}
});

/**
 * Recipe Controller 
 */
const consoleRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 1. Prepare of UI
        recipeView.clearRecipe();
        displayLoader(elements.recipe);
        
        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new object Recipe
        state.recipe = new Recipe(id);
        
        
        try {
            // 2. Retrieve the Recipe
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
            // 3. Calculate time and serving
            state.recipe.calcTime();
            state.recipe.calServings();
        
            // 4. Render the Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.like.isLiked(id));
        } catch(error) {
            console.log(error); //'Error retrieving recipe'
        }
    }
    
};

/**
 * List Controller 
 */

 const consoleList = () => {
    if (!state.list) { state.list = new List(); }

    // Add ingredients to the list and render
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

 };

 // Delete item from shopping list
 elements.shopping.addEventListener('click', el => {
    const itemID = el.target.closest('.shopping__item').dataset.itemid;

    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from Model
        state.list.deleteItem(itemID);

        // Delete from View
        listView.deleteItem(itemID);

    // Handle count update
    } else if (el.target.matches('.shopping__count-value')) {

        const val = parseFloat(el.target.value, 10);
        state.list.updateCount(itemID, val);
    }
 });

/**
 * Like Controller 
 */
// TEST

const consoleLike = () => {
    if (!state.like) state.like = new Like();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.like.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.like.addLike(
            currentID, state.recipe.title, state.recipe.publisher, state.recipe.img
        );
        // Toggle the like button
        likeView.toggleLikeBtn(true);
        // Add like to the UI list
        likeView.renderLike(newLike);
    } else {
        // User has liked the current recipe

        // Remove like from the state
        state.like.deleteLike(currentID);
        // Toggle the like button
        likeView.toggleLikeBtn(false);
        // Remove like from the UI
        likeView.deleteLike(currentID);
    }  
    likeView.toggleLikeMenu(state.like.getNumLikes());
};

// Restore Liked recipes each time page loads
window.addEventListener('load', () => {
    state.like = new Like();
    // Restore Likes
    state.like.readStorage();
    // Toggle button
    likeView.toggleLikeMenu(state.like.getNumLikes());
    // Render existing likes
    state.like.likes.forEach(el => likeView.renderLike(el));
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, consoleRecipe));

elements.recipe.addEventListener('click', e => {
    // Decrease button
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button
        if (state.recipe.servings < 100) {
            state.recipe.updateServings('inc');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add to shopping list
        consoleList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add to liked list
        consoleLike();
    }
});
