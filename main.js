const form = document.querySelector('#form');
const insertedActivity = document.querySelector('#activity-input');
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

    element.addEventListener('click', () => {
      element.classList.toggle('strike');
      element.classList.toggle('soften');
    });

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

  
  // drag feature
  newElement.setAttribute('draggable', true);
  // attachDragEvents(newElement);


  
  activitiesContainer.appendChild(newElement);
  newElement.appendChild(removeButton);
  
  saveActivitiesToLocalStorage();
}

const removeActivity = (event) => {
  const activityElement = event.target.parentNode;
  const activityText = activityElement.textContent.replace('X', '').trim();
  
  // Remove the element from the DOM
  activitiesContainer.removeChild(activityElement);

  // Remove the element from local storage
  removeActivityFromLocalStorage(activityText);
} 

const removeActivityFromLocalStorage = (activityText) => {
  let activities = JSON.parse(localStorage.getItem('activities'));
  // Filter out the removed activity
  activities = activities.filter(activity => activity !== activityText);
  // Save the updated activities list to local storage
  localStorage.setItem('activities', JSON.stringify(activities));
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

// Function to attach drag events
const attachDragEvents = (element) => {
  element.addEventListener('dragstart', handleDragStart);
  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('drop', handleDrop);
  element.addEventListener('dragenter', handleDragEnter);
  element.addEventListener('dragleave', handleDragLeave);
};

// Drag and Drop Event Handlers
// let draggedItem = null;

// const handleDragStart = (e) => {
//   draggedItem = e.target;
//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', e.target.innerHTML);
// };

// const handleDragOver = (e) => {
//   e.preventDefault();
//   e.dataTransfer.dropEffect = 'move';
// };

// const handleDrop = (e) => {
//   e.preventDefault();
//   if (e.target.className === 'activity' && draggedItem !== e.target) {
//       e.target.parentNode.insertBefore(draggedItem, e.target.nextSibling);
//       saveActivitiesToLocalStorage();
//   }
// };

// const handleDragEnter = (e) => {
//   e.preventDefault();
// };

// const handleDragLeave = (e) => {
//   e.preventDefault();
// };

// // Call this function initially to attach events to already existing items
// const initializeDragEvents = () => {
//   document.querySelectorAll('.activity').forEach(item => attachDragEvents(item));
// };

// document.addEventListener('DOMContentLoaded', () => {
//   loadActivitiesFromLocalStorage();
//   initializeDragEvents(); // Initialize drag events after loading activities
// });
