import { Injectable } from '@angular/core';

let todos = [];

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

  get(query = '', storage) {
    return new Promise(resolve => {
      let data;

      if (todos.length === 0 && storage !== null) { todos = storage; }

      if (query === 'completed' || query === 'active') {
        const isCompleted = query === 'completed';
        data = todos.filter(todo => todo.isDone === isCompleted);
        resolve(data);
      } else {
        data = todos;
        resolve(data);
      }
    });
  }

  add(data) {
    return new Promise(resolve => {
      todos.push(data);
      resolve(data);
    });
  }

  put(changed) {
    return new Promise(resolve => {
      const index = todos.findIndex(todo => todo === changed);
      todos[index].title = changed.title;
      resolve(changed);
    });
  }

  delete(id) {
    return new Promise(resolve => {
      const index = todos.findIndex(todo => todo.id === id);
      todos.splice(index, 1);
      resolve(true);
    });
  }

  deleteCompleted() {
    return new Promise(resolve => {
      todos = todos.filter(todo => !todo.isDone);
      resolve(todos);
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

