export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResPage: document.querySelector('.results__pages'),
    searchResList : document.querySelector('.results__list'),
    recipe: document.querySelector('.recipe'),
    recipeIng: document.querySelector('.recipe__ingredients'),
    shopping: document.querySelector('.shopping__list'),
    likeMenu: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list')
};

const stringElements = {
    loader: 'loader'
};

export const displayLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${stringElements.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
}