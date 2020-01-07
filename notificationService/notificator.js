const gmailSenderMod = require('./gmailSender');

class Notificator {
     /**
  * Create a Notificator.
  * 
  * @constructor
  */
    constructor() {
        this._subscriptions = new Map();
    }

     /**
   * create a new notificator entry.
   * 
   * @public
   * @param {int} id an id to identify a new entry.
   */
    createSubscription(id) {
        this._subscriptions.set(id, []);
    }
    
     /**
   * subscribe email to id notification.
   * 
   * @public
   * @param {int} id The entry id.
   * @param {string} email The email to notify.
   */
    subscribe(id, email) {
        if (!this.hasSubscription(id))
            this.createSubscription(id);
        if(!this.hasEntry(id, email))
            this._subscriptions.get(id).push(email);
    }

      /**
   * unsubscribe email to id notification.
   * 
   * @public
   * @param {int} id The id notification.
   * @param {string} email The email to unsubscribe.
   */
    unsubscribe(id, email) {
        if(this.hasEntry(id, email))
            this._subscriptions.get(id).splice(this._subscriptions.get(id).indexOf(email),1);
    }
    
       /**
   * remove entry to notificator.
   * 
   * @public
   * @param {int} id an id to identify a entry.
   */
    removeSubscription(id) {
        if (this.hasSubscription(id))
            this._subscriptions.delete(id);
    }

       /**
   * search id subscription if not doesn't exists return false else true.
   * 
   * @public
   * @param {int} id an id to search entry.
   */
    hasSubscription(id) {
        return this._subscriptions.has(id);
    }

    /**
   * notify all email to id entry with a message
   * 
   * @param {int} id an id to search subscriptors.
   * @param {string} message an message to notify.
   */
    notify(id, dataMail) {
        if (this.hasSubscription(id)) {
            this._subscriptions.get(id).forEach((email) => gmailSenderMod.GmailSender.send(email, dataMail));
        }
    }


    /**
   * search id subscription and email subscribed
   * if any doesn't exists returns false else true.
   * 
   * @public
   * @param {int} id an id to search entry.
   * @param {string} email an email subscribed to an id.
   */
    hasEntry(id, email){
        if (!this.hasSubscription(id))
            return false;
        return this._subscriptions.get(id).includes(email); 
    }

    /**
     * gets all subscriptions from an id
     * 
     * @returns {Array} an array containing subscribed emails
     * @param {int} id an id to search entry
     */
    getAllSubscriptors(id) {
        if(this._subscriptions.has(id)){
            return this._subscriptions.get(id)
        } else {
            return [];
        }
    }

}
module.exports = {
    Notificator,
}
