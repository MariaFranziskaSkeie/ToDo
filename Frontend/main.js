import Translator from './Modules/translator.js';

const translator = new Translator();

// Translate welcome message based on selected language
document.getElementById('language').addEventListener('change', () => {
  document.getElementById('welcomeMessage').innerText = translator.translate('todo');
});

document.getElementById('welcomeMessage').innerText = translator.translate('todo');

// Login/logout button event listeners
document.getElementById('loginUser').addEventListener('submit', userLogin);
document.getElementById('logoutButton').addEventListener('click', logout);

const todoPage = document.getElementById('todoPage');
const createListButton = document.getElementById('createListButton');
const createListPopup = document.getElementById('createListPopup');
const createListForm = document.getElementById('createListForm');

createListButton.addEventListener('click', function () {
  createListPopup.style.display = 'block';
});

createListForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const listName = document.getElementById('listName').value;
  const bulletPoints = Array.from(document.querySelectorAll('#bulletPointsContainer .bulletPoint')).map((input) => input.value);
  createList(listName, bulletPoints);
  createListPopup.style.display = 'none';
});

function createList(name, points) {
  // Get the container for the todo list
  const todoListContainer = document.getElementById('todo-list');

  // Create the todo list element
  const todoList = document.createElement('div');
  todoList.classList.add('todoList');

  // Create the header for the todo list
  const header = document.createElement('h2');
  header.textContent = name;

  // Create the list of bullet points for the todo list
  const bulletPoints = document.createElement('ul');

  // Loop through each bullet point and create a list item for it
  points.forEach((point) => {
    const bulletPoint = document.createElement('li');
    bulletPoint.textContent = point;

    // Create the edit button for the bullet point
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('editButton');
    bulletPoint.appendChild(editButton);

    // Create the delete button for the bullet point
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    bulletPoint.appendChild(deleteButton);

    // Add event listener to the edit button to allow modification of the bullet point
    editButton.addEventListener('click', () => {
      const newText = prompt('Enter the new text for this bullet point:', bulletPoint.textContent);
      if (newText !== null && newText.trim() !== '') {
        bulletPoint.textContent = newText.trim();
        saveTodoList();
      }
    });

    // Add event listener to the delete button to remove the bullet point
    deleteButton.addEventListener('click', () => {
      const confirmDelete = confirm('Are you sure you want to delete this bullet point?');
      if (confirmDelete) {
        bulletPoint.remove();
        saveTodoList();
      }
    });

    // Add the bullet point to the list of bullet points
    bulletPoints.appendChild(bulletPoint);
  });

  // Create the input field and add button for adding bullet points
  const addBulletPointInput = document.createElement('input');
  addBulletPointInput.type = 'text';
  addBulletPointInput.placeholder = 'Add a new bullet point';

  const addBulletPointButton = document.createElement('button');
  addBulletPointButton.textContent = 'Add';
  addBulletPointButton.classList.add('addButton');

  // Add event listener to the add button to add a new bullet point
  addBulletPointButton.addEventListener('click', () => {
    const newBulletPoint = addBulletPointInput.value.trim();
    if (newBulletPoint !== '') {
      const bulletPoint = document.createElement('li');
      bulletPoint.textContent = newBulletPoint;

      // Create the edit button for the bullet point
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('editButton');
      bulletPoint.appendChild(editButton);

      // Create the delete button for the bullet point
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('deleteButton');
      bulletPoint.appendChild(deleteButton);

      // Add event listener to the edit button to allow modification of the bullet point
      editButton.addEventListener('click', () => {
        const newText = prompt('Enter the new text for this bullet point:', bulletPoint.textContent);
        if (newText !== null && newText.trim() !== '') {
          bulletPoint.textContent = newText.trim();
          saveTodoList();
        }
      });

      // Add event listener to the delete button to remove the bullet point
      deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this bullet point?');
        if (confirmDelete) {
          bulletPoint.remove();
          saveTodoList();
        }
      });

      // Add the bullet point to the list of bullet points
      bulletPoints.appendChild(bulletPoint);

      // Clear the input field and save the updated todo list
      addBulletPointInput.value = '';
      saveTodoList();
    }
  });

  // Add the header, bullet points, input field, and add button to the todo list element
  todoList.appendChild(header);
  todoList.appendChild(bulletPoints);
  todoList.appendChild(addBulletPointInput);
  todoList.appendChild(addBulletPointButton);

  // Add the todo list element to the todo list container
  todoListContainer.appendChild(todoList);
}
function saveTodoList() {
  let todoListContainer = document.getElementById('todo-list');
  let todoLists = [];
  let todoListsArray = Array.from(todoListContainer.children);
  for (let i = 0; i < todoListsArray.length; i++) {
    let name = todoListsArray[i].querySelector('h2').textContent;
    let points = Array.from(todoListsArray[i].querySelectorAll('li')).map((point) => point.textContent);
    todoLists.push({ name, points });
  }
  localStorage.setItem('todoLists', JSON.stringify(todoLists));
}

window.addEventListener('load', () => {
  let todoLists = JSON.parse(localStorage.getItem('todoLists'));
  if (todoLists) {
    todoLists.forEach((todoList) => {
      createList(todoList.name, todoList.points);
    });
  }
});

function logout() {
  localStorage.clear();
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('todoPage').style.display = 'none';
  document.getElementById('loginCreateUserButton').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'none';
}

// Login function
async function userLogin(event) {
  if (event !== undefined) {
    event.preventDefault();
  }

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      localStorage.setItem('username', username);
      const data = await response.json();
      localStorage.setItem('loginToken', data.token);

      const loginPage = document.getElementById('loginPage');
      const todoPage = document.getElementById('todoPage');
      const loginButton = document.getElementById('loginCreateUserButton');
      const logoutButton = document.getElementById('logoutButton');

      loginPage.style.display = 'none';
      todoPage.style.display = 'grid';

      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
    } else {
      const errorMessage = await response.json();
      alert('Error logging in: ' + errorMessage.message);
    }
  } catch (error) {
    alert('Error contacting server: ' + error.message);
  }
}

// Create user button event listener
document.getElementById('loginCreateUserButton').addEventListener('click', () => {
  document.getElementById('loginCreateUserPage').style.display = 'grid';
});

// Close create user popup
function closeUserPopup() {
  document.getElementById('loginCreateUserPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'grid';

  document.getElementById('loginNewUsername').value = '';
  document.getElementById('loginNewPassword').value = '';
  document.getElementById('loginRepeatPassword').value = '';
}

// Create user form submit event listener
document.getElementById('loginCreateUserForm').addEventListener('submit', async function (e) {
  const usernameInput = document.getElementById('loginNewUsername');
  const passwordInput = document.getElementById('loginNewPassword');
  const repeatPasswordInput = document.getElementById('loginRepeatPassword');

  const username = usernameInput.value;
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  if (password !== repeatPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      closeUserPopup();
    } else {
      const errorMessage = await response.json();
      alert('Error creating user: ' + errorMessage.message);
    }
  } catch (error) {
    alert('Error contacting server: ' + error.message);
  }
});

// Create list button event listener

createListButton.addEventListener('click', function () {
  // Show the create list popup
  createListPopup.style.display = 'block';
});

const closeButton = document.querySelector('.close-button');

if (closeButton) {
  closeButton.addEventListener('click', function () {
    // Close the popup
    createListPopup.style.display = 'none';
  });
}

const addBulletButton = document.getElementById('addBulletButton');
const bulletPointsContainer = document.getElementById('bulletPointsContainer');

addBulletButton.addEventListener('click', function () {
  const newBulletInput = document.createElement('input');
  newBulletInput.type = 'text';
  newBulletInput.name = 'bulletPoint';
  newBulletInput.classList.add('bulletPoint');
  bulletPointsContainer.appendChild(newBulletInput);
});

if (localStorage.getItem('username')) {
  userLogin();
}

