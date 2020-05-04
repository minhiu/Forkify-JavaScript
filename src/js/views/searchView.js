import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
}

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitResult = (title, limit = 17) => {
    let sum = 0;
    const result = [];

    if (title.length > limit) {
        let titleArr = title.split(' ');
        
        titleArr.forEach(cur => {
            if (sum <= limit - cur.length) {
                sum += cur.length;
                result.push(cur);
            }
        });
        return `${result.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipes => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipes.recipe_id}">
                <figure class="results__fig">
                    <img src=${recipes.image_url} alt=${recipes.title}>
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitResult(recipes.title)}</h4>
                    <p class="results__author">${recipes.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}
// 1. page = 1, pages > 1 => front = page + 1
// 2. page = 2, page < pages => back = page - 1, front = page + 1
// 3. page = 3, pages > 1 => back = page - 1 
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page + 1 : page - 1}>
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);
    let button;
    
    if (page === 1 && pages > 1) {
        // Insert front button
        button = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // Insert prev button
        button = createButton(page, 'prev'); 
    } else if (page < pages) {
        // Insert both buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    }
    elements.searchResPage.insertAdjacentHTML('afterbegin', button);
}


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // Render page buttons
    renderButtons(page, recipes.length, resPerPage);
}