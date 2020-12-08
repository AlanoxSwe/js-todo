/* eslint-disable max-len */

import '../style/todo.css';
import '../style/normalize.css';

const titleInput = document.querySelector('#title');
const descInput = document.querySelector('#desc');
const colorInput = document.querySelector('#color');
const addBtn = document.querySelector('#add-btn');

const itemSection = document.querySelector('.items');

let todos = [];

// FUNCTIONS

const nextId = (arr) => {
  const highestId = arr.reduce((accumulator, currentValue) => (currentValue.id > accumulator ? currentValue.id : accumulator), 0);
  return Number.parseInt(highestId, 0) + 1;
};

const clearForm = () => {
  titleInput.value = '';
  descInput.value = '';
};

const createItemHtml = (title, desc, completed, id, color) => `
  <article class="post-it ${color}${completed ? ' completed' : ''}" id="${id}">
    ${completed ? '<button>&#10006;</button>' : ''}
    <p class="post-it-title">
      ${title}
    </p>
    <p class="post-it-body">
      ${desc}
    </p>
  </article>
  `;

const displayItems = (arr) => {
  itemSection.innerHTML = '';
  arr.forEach((item) => {
    itemSection.innerHTML += createItemHtml(item.title, item.desc, item.completed, item.id, item.color);
  });
  localStorage.setItem('todos', JSON.stringify(todos));
};

const moveTodoToLast = (todo) => {
  todos.push(todos.splice(todos.indexOf(todo), 1)[0]);
};

const createTodo = (id, title, desc, color) => {
  const todo = {
    id,
    title,
    desc,
    completed: false,
    color,
  };
  todos.push(todo);
  displayItems(todos);
};

const getTodo = (id) => todos.find((item) => item.id === id);

const completeTodo = (id) => {
  const todo = getTodo(id);
  if (!todo.completed) moveTodoToLast(todo);
  todo.completed = !todo.completed;
  displayItems(todos);
};

const deleteTodo = (id) => {
  const todo = getTodo(id);
  todos = todos.filter((item) => item.id !== todo.id);
  displayItems(todos);
};

// EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'));
    displayItems(todos);
  }
});

addBtn.addEventListener('click', (e) => {
  const title = titleInput.value;
  const desc = descInput.value;
  const color = colorInput.value;

  e.preventDefault();
  if (title && desc) createTodo(nextId(todos).toString(), title, desc, color);
  clearForm();
});

itemSection.addEventListener('click', (e) => {
  switch (e.target.tagName) {
    case 'P':
      completeTodo(e.target.parentElement.getAttribute('id'));
      break;
    case 'ARTICLE':
      completeTodo(e.target.getAttribute('id'));
      break;
    case 'BUTTON':
      deleteTodo(e.target.parentElement.getAttribute('id'));
      break;
    default:
  }
});
