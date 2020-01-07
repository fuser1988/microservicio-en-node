class Observer {

    refresh(object, data) {
      throw Error('Error - Observer.notify() Not Implemented');
    }
}

module.exports = { Observer };