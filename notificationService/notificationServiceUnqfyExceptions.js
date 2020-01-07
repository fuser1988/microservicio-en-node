
class NotificationServiceUnqfyException extends Error {
    constructor(messg) {
        super('Notification Service UNQfy Error - '+messg);
    }
}

class NotFoundArtistException extends NotificationServiceUnqfyException {
    constructor(idArtist) {
        super('Not found artist with id: ' + idArtist);
    }
}

class NotFoundSubscriptionException extends NotificationServiceUnqfyException {
    constructor(email, id) {
        super('Not found subscription with email <'+email+ '> or artist id <'+id+'>');
    }
}

module.exports = {
    NotificationServiceUnqfyException, NotFoundArtistException, NotFoundSubscriptionException
};