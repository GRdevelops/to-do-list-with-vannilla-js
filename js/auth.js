import { createAuth0Client } from '@auth0/auth0-spa-js';

// AUTHENTICATION
const auth0 = await createAuth0Client({
	domain: 'desengineers.eu.auth0.com',
	clientId: 'HU2tnn1e75i4PdjuFRP1ovHe6bcxcnvs',
	// cacheLocation: 'localstorage',
	// redirect_uri: 'http://localhost:5173/',
});

const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');

loginButton.addEventListener('click', async () => {
	await auth0.loginWithRedirect({
		authorizationParams: {
			redirect_uri: 'http://localhost:5173/',
		},
	});
});

logoutButton.addEventListener('click', async () => {
	auth0.logout({
		logoutParams: {
			returnTo: 'http://localhost:5173/',
		},
	});
});

// call an api
document.getElementById('callApi').addEventListener('click', async () => {
  const accessToken = await auth0.getTokenSilently();

	const data = {
		content: "prova statica",
	};

  const result = await fetch('http://localhost:8080/tasks/', data, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
  const task = await result.json();
  console.log(task);
});

document.getElementById('check-user').addEventListener('click', async event => {
	const user = await auth0.getUser();
	console.log('User:', user);
});

window.onload = async () => {
	if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
		await auth0.handleRedirectCallback();
		window.history.replaceState({}, document.title, '/'); // Clean up URL
	}
};
