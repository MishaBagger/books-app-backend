class UserDto {
    id
    login
    username


    constructor (model) {
        this.id = model.id
        this.login = model.login
        this.username = model.username
    }
}

class UserDataDto {
    email
    phone
    role
    uuid

    constructor (model) {
        this.email = model.email
        this.phone = model.phone
        this.role = model.role
        this.uuid = model.uuid
    }
}

module.exports = {UserDto, UserDataDto}