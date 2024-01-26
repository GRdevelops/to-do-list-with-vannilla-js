// let nextActivityId = parseInt(localStorage.getItem('nextActivityId')) || 0;

// const clearInputField = () => {
//   insertedActivity.value = '';
// }

// const preventDefaultFormBehaviour = (e) => {
//   e.preventDefault();
// }

// // test
// const log = (item) => {
//   console.log(item);
// }

// const addActivity = (activity, id = null) => {
//   if (id === null) {
//     id = nextActivityId++;
//     localStorage.setItem('nextActivityId', nextActivityId.toString());
//   }
//   const createActivityElement = (activity) => {
//     const element = document.createElement('div');
//     element.innerText = activity;
//     element.classList.add('activity');
//     return element;
//   }
//   const createRemoveButton = () => {
//     const button = document.createElement('div');
//     button.innerText = 'X'
//     button.classList.add('remove-button');
//     button.addEventListener('click', removeActivity);
//     return button;
//   }
//   const newElement = createActivityElement(activity);
//   const removeButton = createRemoveButton();
//   newElement.dataset.id = id;
//   activitiesContainer.appendChild(newElement);
//   newElement.appendChild(removeButton);
//   saveActivitiesToLocalStorage();
// }

// const removeActivity = (event) => {
//   const activityElement = event.target.parentNode;
//   const activityId = activityElement.dataset.id;
//   // Remove the element from the DOM
//   activitiesContainer.removeChild(activityElement);
//   // Remove the element from local storage
//   removeActivityFromLocalStorage(activityId);
// } 

// // Handle browser STORAGE
// const removeActivityFromLocalStorage = (activityId) => {
//   let activities = JSON.parse(localStorage.getItem('activities'));
//   // Filter out the removed activity
//   activities = activities.filter(activity => activity.id !== activityId);
//   // Save the updated activities list to local storage
//   localStorage.setItem('activities', JSON.stringify(activities));
// }
// const saveActivitiesToLocalStorage = () => {
//   let activities = [];
//   document.querySelectorAll('.activity').forEach(activity => {
//     activities.push({
//       id: activity.dataset.id,
//       text: activity.innerText.replace('X', '').trim()
//     });
//   });
//   localStorage.setItem('activities', JSON.stringify(activities));
// }
// const loadActivitiesFromLocalStorage = () => {
//   const storedActivities = JSON.parse(localStorage.getItem('activities'));
//   if (storedActivities) {
//     storedActivities.forEach(activity => addActivity(activity.text, activity.id));
//   }
// }

// const handleSubmit = (event) => {
//   preventDefaultFormBehaviour(event);
//   const newActivity = insertedActivity.value;
//   if (newActivity) {
//     // log(newActivity);
//     addActivity(newActivity);
//     clearInputField();
//   }
// };