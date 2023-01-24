import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoService } from './todo.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [ TodoService, LocalStorageService ]
})
export class TodoComponent implements OnInit {
  public todos;
  public activeTasks;
  public newTodo;
  public path;
  private nextId;

  constructor(private todoService: TodoService, private route: ActivatedRoute, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.path = params['status'];
      this.getTodos(this.path);
    });
  }

  getTodos(query = '') {
    const currentTodoList = this.localStorageService.getLocalStore();

    return this.todoService.get(query, currentTodoList).then(todos => {
      this.todos = todos;
      this.activeTasks = this.todos.filter(todo => !todo.isDone).length;
    });
  }

  addTodo() {
    this.nextId = this.todoService.getRandomInt(0, 10000);

    if (this.newTodo === undefined || this.newTodo === '') { return; }

    return this.todoService.add({title: this.newTodo, isDone: false, id: this.nextId}).then(() => {
      this.localStorageService.storeOnLocalStorage(this.newTodo, this.nextId);
      return this.getTodos(this.path);
    }).then(() => {
      this.newTodo = '';
    });
  }

  updateTodo(todo, newValue) {
    todo.title = newValue;
    return this.todoService.put(todo).then(() => {
      todo.editing = false;
      this.localStorageService.updateLocalStorage(todo);
      return this.getTodos(this.path);
    });
  }

  destroyTodo(todo) {
    this.todoService.delete(todo.id).then(() => {
      this.localStorageService.removeFromLocalStorage(todo.id);
      return this.getTodos(this.path);
    });
  }

  toggleComplete() {
    this.getTodos(this.path);
    this.localStorageService.toggleIsDoneVal(this.todos);
  }

  clearCompleted() {
    this.todoService.deleteCompleted().then((todos) => {
      this.localStorageService.deleteCompletedFromLocalStorage(todos);
      return this.getTodos(this.path);
    });
  }
}
