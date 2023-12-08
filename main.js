const form = document.querySelector('#form');
const insertedActivity = document.querySelector('#activity');
const activitiesContainer = document.querySelector('#activities');


const clearInputField = () => {
  insertedActivity.value = '';
}

const preventDefaultFormBehaviour = (e) => {
  e.preventDefault();
}

// test
const log = (item) => {
  console.log(item);
}

const addActivity = (activity) => {
  const createActivityElement = (activity) => {
    const element = document.createElement('div');
    element.innerText = activity;
    element.classList.add('activity');
    return element;
  }
  const createRemoveButton = () => {
    const button = document.createElement('div');
    button.innerText = 'X'
    button.classList.add('remove-button');
    button.addEventListener('click', removeActivity);
    return button;
  }
  
  const newElement = createActivityElement(activity);
  const removeButton = createRemoveButton();
  
  activitiesContainer.appendChild(newElement);
  newElement.appendChild(removeButton);
  
  saveActivitiesToLocalStorage();
}

const removeActivity = (event) => {
  const activityElement = event.target.parentNode;
  activitiesContainer.removeChild(activityElement);
} 

const handleSubmit = (event) => {
  preventDefaultFormBehaviour(event);
  const newActivity = insertedActivity.value;
  if (newActivity) {
    // log(newActivity);
    addActivity(newActivity);
    clearInputField();
  }
};

const saveActivitiesToLocalStorage = () => {
  let activities = [];
  document.querySelectorAll('.activity').forEach(activity => {
    activities.push(activity.innerText.replace('X', '').trim());
  });
  localStorage.setItem('activities', JSON.stringify(activities));
}

const loadActivitiesFromLocalStorage = () => {
  const storedActivities = JSON.parse(localStorage.getItem('activities'));
  if (storedActivities) {
    storedActivities.forEach(activity => addActivity(activity));
  }
}

form.addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', loadActivitiesFromLocalStorage);



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

