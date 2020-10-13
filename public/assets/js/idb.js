

// CREATE VARIABLE TO HOLD DB CONNECTION
let db;

// ESTABLISH A CONNECTION TO INDEXED DB DATABASE CALLED 'pizza_hunt' AND SET IT TO VERSION 1
const request = indexedDB.open('pizza_hunt', 1);

// THIS EVENT WILL EMIT IF THE DATABASE VERSION CHANGES (NONEXISTANT TO VERSION 1, V1 TO V2, ETC.)
request.onupgradeneeded = function(event) {
    // SAVE A REFERENCE TO THE DATABASE
    const db = event.target.result;
    // CREATE AN OBJECT STORE (TABLE) CALLED 'new_pizza', SET IT TO HAVE AN AUTO INCREMENTING PRIMARY KEY OF SORTS
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// UPON A SUCCESSFUL
request.onsuccess = function(event) {
    // WHEN DB IS SUCCESSFULLY CREATED WITH ITS OBJECT STORE (FROM ONUPGRADEDNEDDED EVENT ABOVE) OR SIMPLY ESTABLISHED A CONNECTION, SAVE REFERENCE TO DB IN GLOBAL VARIABLE
    db = event.target.results;

    // CHECK IF APP IS ONLINE, IF YES RUN uploadPizza() FUNCTION TO SEND ALL LOCAL DB DATA TO API
    if (navigator.online) {

    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// THIS FUNCTION WILL BE EXECUTED IF WE ATTEMPT TO SUBMIT A NEW PIZZA AND THERE IS NO INTERNET CONNECTION
function saveRecord(record) {
    // OPEN A NEW TRANSACTION WITH THE DATABASE WITH READ AND WRITE PERMISSIONS
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // ACCESS THE OBJECT STORE FOR 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // ADD RECORD TO YOUR STORE WITH ADD METHOD
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // OPEN A TRANSACTION ON YOUR DB
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // ACCESS YOUR OBJECT STORE
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // GET ALL RECORDS FROM STORE AND SET TO A VARIABLE
    const getAll = pizzaObjectStore.getAll();

    // UPON A SUCCESSFUL .getAll() EXECUTION, RUN THIS FUNCTION
    getAll.onsuccess = function() {
        // IF THERE WAS DATA IN INDEXED DB'S STORE, LET'S SEND IT TO THE API SERVER
        if (getAll.results.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.results),
                headers: {
                    Accept: 'application/json, text/plain, */*' ,
                    'Content-Type' : 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // OPEN ONE MORE TRANSACTION
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // ACCESS THE new_pizza OBJECT STORE
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // CLEAR ALL ITEMS IN YOUR STORE
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}