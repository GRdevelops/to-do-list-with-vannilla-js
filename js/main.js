import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
	domain: import.meta.env.VITE_AUTH0_DOMAIN,
	clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
});

const form = document.querySelector('#form');
// const insertedActivity = document.querySelector('#activity-input');
const activitiesContainer = document.querySelector('#activities');

// Dark Mode + keep dark mode on reload
const darkModeButton = document.getElementById('dark-mode');
let debounceTimer;
darkModeButton.addEventListener('click', () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		document.body.classList.toggle('dark');
		// Update preference on toggle
		const isDarkMode = document.body.classList.contains('dark');
		localStorage.setItem('darkMode', isDarkMode);
	}, 100);
});
// Check and apply user's preference on page load
document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('darkMode') === 'true') {
		darkModeButton.click(); // Simulate a click if the stored preference is dark mode
	}
});

// Components Factory
const taskMaker = taskObject => {
	const content = taskObject.content;
	const id = taskObject.id;

	const createActivityElement = content => {
		const shell = document.createElement('div');
		shell.classList.add('shell');
		const element = document.createElement('div');
		element.classList.add('activity');
		const editableElement = document.createElement('div');
		editableElement.classList.add('editable-element');
		editableElement.innerText = content;
		editableElement.contentEditable = true;
		element.spellcheck = false;
		editableElement.addEventListener('keypress', event => {
			if (event.key === 'Enter') {
				event.preventDefault(); // Prevents creating a new line
				modifyTask(event);
				// Manually remove focus from the editableElement to simulate 'end of editing'
				editableElement.blur();
			}
		});
		editableElement.addEventListener('blur', event => {
			modifyTask(event);
			shell.classList.remove('focused');
		});
		editableElement.addEventListener('focus', () => {
			shell.classList.add('focused');
		});

		element.appendChild(editableElement);
		shell.appendChild(element);

		return shell;
	};

	const createRemoveButton = () => {
		const button = document.createElement('div');
		button.classList.add('remove-button');
		const line = document.createElement('div');
		line.classList.add('line');
		button.appendChild(line);
		const secondLine = document.createElement('div');
		secondLine.classList.add('line', 'second');
		button.appendChild(secondLine);
		button.addEventListener('click', deleteTask);
		return button;
	};

	const newElement = createActivityElement(content);
	const removeButton = createRemoveButton();
	newElement.dataset.id = id;
	activitiesContainer.appendChild(newElement);
	newElement.appendChild(removeButton);

	return newElement;
};

// Load All Tasks
const loadTasks = async () => {
	const displayTasksOnUI = tasks => {
		while (activitiesContainer.firstChild) {
			activitiesContainer.removeChild(activitiesContainer.firstChild);
		}

		// for every task create an element
		for (let task of tasks) {
			taskMaker(task);
		}
	};

	// fetch the data from the database
	try {
		const accessToken = getAccessToken();
		// console.log('Access Token: ', accessToken);

		const user = await auth0.getUser();
		const userEmail = user.email;

		const response = await axios.get(`http://localhost:8080/tasks/user/${userEmail}`, {
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		});
		const dataArray = response.data;
		// console.log('Tasks loaded: ', dataArray);
		displayTasksOnUI(dataArray);
	} catch (e) {
		console.log('Error: ', e);
	}
};

// Add a new task
const addTask = async taskContent => {
	try {
		const accessToken = getAccessToken();
		const user = await auth0.getUser();

		if (!user) {
			return alert("Can't add tasks. 🙁\nPlease login to your account. ");
		}

		const userEmail = user.email;

		const response = await axios.post(
			'http://localhost:8080/tasks',
			{
				user: `${userEmail}`,
				content: `${taskContent}`,
			},
			{
				headers: {
					Authorization: 'Bearer ' + accessToken,
				},
			}
		);
		const task = response.data;
		// console.log('Data successfully sent:', task);
		loadTasks();
	} catch (error) {
		console.log('Error :', error);
	}
};

const handleSubmit = event => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const taskContent = formData.get('task').trim();

	if (!taskContent) {
		console.log('Task field is empty. Form not submitted.');
		return;
	}

	addTask(taskContent);

	// clear form
	event.target.reset();
};

form.addEventListener('submit', handleSubmit);

// Delete a task
const deleteFromDatabase = async taskId => {
	try {
		const response = await axios.delete(`http://localhost:8080/tasks/${taskId}`);
		// console.log(response.data);
		loadTasks();
	} catch (error) {
		console.log('Error: ', error);
	}
};

const deleteTask = event => {
	const taskElement = event.target.parentNode;
	const taskId = taskElement.dataset.id;
	// Remove the element from the DOM
	// activitiesContainer.removeChild(taskElement);
	// Remove the element from local storage
	deleteFromDatabase(taskId);
};

// Modify a task
const modifyTask = async event => {
	const updatedContent = event.target.innerText;
	const firstParent = event.target.parentNode;
	const taskId = firstParent.parentNode.dataset.id;

	try {
		const accessToken = await auth0.getTokenSilently();
		const response = await axios.put(
			`http://localhost:8080/tasks/${taskId}`,
			{
				content: updatedContent,
			},
			{
				headers: {
					Authorization: 'Bearer ' + accessToken,
				},
			}
		);
		// console.log('Update successful:', response);
	} catch (error) {
		console.error('Error updating task', error);
	}
};

// Implementare facciata dove vedere le task completate

// AUTHENTICATION

async function getAccessToken() {
	const accessToken = await auth0.getTokenSilently();
	return accessToken;
}

const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');

loginButton.addEventListener('click', async () => {
	await auth0.loginWithRedirect({
		authorizationParams: {
			redirect_uri: `${window.location.origin}/`,
		},
	});
});

logoutButton.addEventListener('click', async () => {
	auth0.logout({
		logoutParams: {
			returnTo: `${window.location.origin}/`,
		},
	});
});

const checkAuth = async () => {
	const isAuthenticated = await auth0.isAuthenticated();
	// console.log(isAuthenticated ? "User is authenticated" : "User is not authenticated");
	logoutButton.classList.add('hidden');
	if (isAuthenticated) {
		// User is authenticated, proceed to load tasks or other user-specific data
		loadTasks();
		loginButton.classList.add('hidden');
		logoutButton.classList.remove('hidden');
	}
};

window.onload = async () => {
	if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
		await auth0.handleRedirectCallback();
		window.history.replaceState({}, document.title, '/'); // Clean up URL
		checkAuth(); // Call loadTasks here after handling redirect callback
	} else {
		// Even if there's no auth callback in URL, attempt to load tasks
		checkAuth();
	}
};

checkAuth();

// load tasks on page load
// loadTasks();

// TEST BUTTONS

// // call an api
// document.getElementById('callApi').addEventListener('click', async () => {
// 	try {
// 		const accessToken = await auth0.getTokenSilently();
// 		// console.log("Access Token: ", accessToken);

// 		const postData = {
// 			content: 'prova post request',
// 		};

// 		const config = {
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`,
// 				'Content-Type': 'application/json',
// 			},
// 		};

// 		const response = await axios.post('http://localhost:8080/tasks', postData, config);
// 		const dataArray = await response.data;
// 		console.log('Data posted successfully');
// 	} catch (error) {
// 		console.error('Error making POST request:', error);
// 	}
// });

// // check user
// document.getElementById('check-user').addEventListener('click', async event => {
// 	const user = await auth0.getUser();
// 	console.log('User:', user);
// });
