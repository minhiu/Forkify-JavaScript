export default class Like {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, img) {
        const like = { id, title, publisher, img };
        this.likes.push(like);

        // Persist Data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist Data in local storage
        this.persistData();
    }

    isLiked(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return index !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
};