class User {
    constructor({ name_user, user_handle, password }) {
        this.name_user = name_user;
        this.user_handle = user_handle;
        this.password_hash = password;
        this.points = 0;

    }
}

module.exports = User;
