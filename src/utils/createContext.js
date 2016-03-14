import { Component } from 'react';

export default function createContext(ChildComponent, description, context) {
  return class extends Component {
    static childContextTypes = description;

    getChildContext() {
      return context;
    }

    render() {
      return ChildComponent;
    }
  };
}
