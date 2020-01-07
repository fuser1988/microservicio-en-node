class Subject {

    constructor() {
      this.observers = [];
    }
  
    addObserver(anObserver) {
      if (!this.observers.includes(anObserver)) {
        this.observers.push(anObserver);
      }
    }
  
    removeObserver(anOsberverToRemove) {
      this.observers = this.observers.filter((observer) => observer !== anOsberverToRemove);
    }
  
    notify(object, data) {
      this.observers.forEach(observer => observer.refresh(object, data));
    }

  }

module.exports = { Subject };