var db;
var activeIndex;

var contacts = [
    { id: 1, fName: 'Makron', lName: 'Damage', jTitle: 'Master of Synergies', company: 'Acme', eMail: 'brian@acme.com', phone: '+441210000000', age: 37},
    { id: 2, fName: 'Ted', lName: 'Maul', jTitle: 'Chief Reporter', company: 'Brass eye', eMail: 'ted@itsthenews.co.uk', phone: '+442081111111', age: 46 },
    { id: 3, fName: 'Mr', lName: 'Bungle', jTitle: 'Bad Clown', company: 'Stub a Dub', eMail: 'bungle@maiof.com', phone: '+1508888888', age: 50 },
    { id: 4, fName: 'Richard', lName: 'James', jTitle: 'Sound Engineer', company: 'Aphex Twin', eMail: 'richard@drukqs.com', phone: '+1517777777', age: 43 },
    { id: 5, fName: 'Brian', lName: 'Umlaut', jTitle: 'Shredmeister', company: 'Minions of metal', eMail: 'brian@raiseyourhorns.com', phone: '+14086666666', age: 40 },
    { id: 6, fName: 'Jonathan', lName: 'Crane', jTitle: 'Freelance Psychologist', company: 'Arkham', eMail: 'jon@arkham.com', phone: 'n/a', age: 38 },
    { id: 7, fName: 'Julian', lName: 'Day', jTitle: 'Schedule Keeper', company: 'Arkham', eMail: 'julian@arkham.com', phone: 'n/a', age: 43 },
    { id: 8, fName: 'Bolivar', lName: 'Trask', jTitle: 'Head of R&D', company: 'Trask', eMail: 'bolivar@trask.com', phone: '+14095555555', age: 55 },
    { id: 9, fName: 'Cloud', lName: 'Strife', jTitle: 'Weapons Instructor', company: 'Avalanche', eMail: 'cloud@avalanche.com', phone: '+17083333333', age: 24 },
    { id: 10, fName: 'Bilbo', lName: 'Bagshot', jTitle: 'Comic Shop Owner', company: 'Fantasy Bazaar', eMail: 'bilbo@fantasybazaar.co.uk', phone: '+12084444444', age: 43 },
    { id: 11, fName: 'Bilbo', lName: 'Makron', jTitle: 'Comic Shop Owner', company: 'Fantasy Bazaar', eMail: 'zuz@kolo.co.uk', phone: '+12084444444', age: 43 },
    { id: 12, fName: 'Bilbo', lName: 'Makron', jTitle: 'Comic Shop Owner', company: 'Fantasy Bazaar', eMail: 'zuklz@kolo.co.uk', phone: '+12084444444', age: 43 },
    { id: 13, fName: 'Bilbo', lName: 'Makron', jTitle: 'Comic Shop Owner', company: 'Fantasy Bazaar', eMail: 'zuklkz@kolo.co.uk', phone: '+12084444444', age: 43 }
];

var tableEntry = document.querySelector('tbody');
const id = "#search-id";
const surname = "#search-surname";
const imie = "#search-name";
const job = "#search-job";
const company = "#search-company";
const email = "#search-email";
const phone = "#search-phone";
const age = "#search-age";
const nazwa_tabeli = "#example-table";

// Here is a method to fileter data -- creator Wojciech Chodasiewicz
function FilterData(nazwa_elemenu, nazwa_tabeli) {
    $(nazwa_elemenu).on("keyup", function() {
      var idValue = $(id).val().trim();
      var surnameValue = $(surname).val().trim();
      var imieValue = $(imie).val().trim();
      var jobValue = $(job).val().trim();
      var companyValue = $(company).val().trim();
      var emailValue = $(email).val().trim();
      var phoneValue = $(phone).val().trim();
      var ageValue = $(age).val().trim();
      var searchValues = [idValue, surnameValue, imieValue, jobValue, companyValue, emailValue, phoneValue, ageValue];
      $(nazwa_tabeli+">tbody>tr").each(function() {
        var showRow = true;
        for (var j=0; j<searchValues.length; j++) {
            if(searchValues[j] == idValue){
                if (searchValues[j] !== "" && !new RegExp("\\b" + searchValues[j] + "\\b", "i").test($(this).find("td:eq(" + j + ")").text())) {
                    showRow = false;
                    break;
                }
            }else if (searchValues[j] !== "" && !$(this).find("td:eq(" + j + ")").text().toLowerCase().includes(searchValues[j].toLowerCase())) {
                showRow = false;
                break;
            }
        }
        if (showRow)
          $(this).show();
        else
          $(this).hide();
      });
    });
  }
  

function isEmpty(str) {
    return !str.length;
}

//Filter ID
FilterData(id, nazwa_tabeli);
//Filter Surname
FilterData(surname, nazwa_tabeli);
//Filter Name
FilterData(imie, nazwa_tabeli);
//Filter job
FilterData(job, nazwa_tabeli);
//Filter company
FilterData(company, nazwa_tabeli);
//Filter email
FilterData(email, nazwa_tabeli);
//Filter phone
FilterData(phone, nazwa_tabeli);
//Filter age
FilterData(age, nazwa_tabeli);


// This is not my implemetation of the code:
window.onload = function(){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var DBOpenRequest = window.indexedDB.open('contactsList', 1);

    DBOpenRequest.onsuccess = function(event) {
        db = DBOpenRequest.result;
        populateData();
    };
  
    DBOpenRequest.onupgradeneeded = function(event) { 
        var db = event.target.result;
        
        db.onerror = function(event) {
            console.log('Error loading database.');
        };
        
        var objectStore = db.createObjectStore('contactsList', { keyPath: 'id' }); 
        objectStore.createIndex('lName', 'lName', { unique: false }); 
        objectStore.createIndex('fName', 'fName', { unique: false });
        objectStore.createIndex('jTitle', 'jTitle', { unique: false });
        objectStore.createIndex('company', 'company', { unique: false });
        objectStore.createIndex('eMail', 'eMail', { unique: false });
        objectStore.createIndex('phone', 'phone', { unique: false });
        objectStore.createIndex('age', 'age', { unique: false });
    };
    
    function populateData() {
        var transaction = db.transaction(['contactsList'], 'readwrite');
        var objectStore = transaction.objectStore('contactsList');
        for(i = 0; i < contacts.length; i++) {
            var request = objectStore.put(contacts[i]);
        };
        transaction.oncomplete = function(){
            displayDataByKey();
        };
    };

  var thControls = document.querySelectorAll('th');
    for(i = 0; i < thControls.length; i++) {
        var activeThead = thControls[i];
        activeThead.onclick = function(e) {
            activeIndex = e.target.innerHTML;
            if(activeIndex == 'ID')
                displayDataByKey(); 
            else {
                if(activeIndex == "Last name")
                displayDataByIndex('lName');
                else if(activeIndex == "First name")
                displayDataByIndex('fName');
                else if(activeIndex == "Job title")
                displayDataByIndex('jTitle');
                else if(activeIndex == "Company")
                displayDataByIndex('company');
                else if(activeIndex == "E-mail")
                displayDataByIndex('eMail');
                else if(activeIndex == "Phone")
                displayDataByIndex('phone');
                else if(activeIndex == "Age")
                displayDataByIndex('age');
            }
        }
    }

    function displayDataByKey(){
        tableEntry.innerHTML = '';
        var transaction = db.transaction(['contactsList'], 'readonly');
        var objectStore = transaction.objectStore('contactsList');

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                var tableRow = document.createElement('tr');
                tableRow.innerHTML =  '<td>' + cursor.value.id      + '</td>'
                                    + '<td>' + cursor.value.lName   + '</td>'
                                    + '<td>' + cursor.value.fName   + '</td>'
                                    + '<td>' + cursor.value.jTitle  + '</td>'
                                    + '<td>' + cursor.value.company + '</td>'
                                    + '<td>' + cursor.value.eMail   + '</td>'
                                    + '<td>' + cursor.value.phone   + '</td>'
                                    + '<td>' + cursor.value.age     + '</td>';
                tableEntry.appendChild(tableRow);  
                cursor.continue();
            }else
                console.log('Entries all displayed.');    
        };
    };

    function displayDataByIndex(activeIndex) {
        tableEntry.innerHTML = '';
        var transaction = db.transaction(['contactsList'], 'readonly');
        var objectStore = transaction.objectStore('contactsList');

        var myIndex = objectStore.index(activeIndex);

        console.log(myIndex.name);
        console.log(myIndex.objectStore);
        console.log(myIndex.keyPath);
        console.log(myIndex.multiEntry);
        console.log(myIndex.unique);
    
        var countRequest = myIndex.count();
        countRequest.onsuccess = function() {
            console.log(countRequest.result);
        }
    
        if(activeIndex == 'fName') {
            var getRequest = myIndex.get('Mr');
            getRequest.onsuccess = function() {
                console.log(getRequest.result);
            }
        }

        if(activeIndex == 'lName') {
            var getKeyRequest = myIndex.getKey('Bungle');
            getKeyRequest.onsuccess = function() {
                console.log(getKeyRequest.result);
            }
        }
     
        myIndex.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                var tableRow = document.createElement('tr');
                tableRow.innerHTML = '<td>' + cursor.value.id + '</td>'
                                + '<td>' + cursor.value.lName + '</td>'
                                + '<td>' + cursor.value.fName + '</td>'
                                + '<td>' + cursor.value.jTitle + '</td>'
                                + '<td>' + cursor.value.company + '</td>'
                                + '<td>' + cursor.value.eMail + '</td>'
                                + '<td>' + cursor.value.phone + '</td>'
                                + '<td>' + cursor.value.age + '</td>';
                tableEntry.appendChild(tableRow);  

                cursor.continue();
        } else
            console.log('Entries all displayed.');    
        };
    };
    
};

