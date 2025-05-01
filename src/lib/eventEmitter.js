// src/lib/eventEmitter.js
// A simple event emitter for cross-component communication

class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    on(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    off(event, listener) {
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  
    emit(event, ...args) {
      if (!this.events[event]) return;
      this.events[event].forEach(listener => listener(...args));
    }
  
    once(event, listener) {
      const onceListener = (...args) => {
        listener(...args);
        this.off(event, onceListener);
      };
      this.on(event, onceListener);
    }
  }
  
  // Export a singleton instance
  const eventEmitter = typeof window !== 'undefined' ? new EventEmitter() : null;
  
  export default eventEmitter;