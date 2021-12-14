export class Player {
    constructor(displayName) {
        this.displayName = displayName
        this.uid = window.$ID_GENERATOR()
    }

    get user() {
        return this.destructure()
    }

    destructure() {
        return {
            displayName: this.displayName,
            uid: this.uid
        }
    }

}

