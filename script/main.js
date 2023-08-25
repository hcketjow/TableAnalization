// Import all nessesary libraries
var db;
var activeIndex;
// JSON data to display them
var contacts = [
    { 
        id: 1, 
        person_name: 'John', 
        surname: 'Doe', 
        age: '20', 
        company_name: 'Apple'
    },
    { 
        id: 2, 
        person_name: 'Dave',
        surname: 'Joe', 
        age: '32', 
        company_name: 'Google'
    },
    { 
        id: 3,
        person_name: 'Ivan', 
        surname: 'Ivanowic', 
        age: '34', 
        company_name: 'Instagram'
    },
    { 
        id: 4, 
        person_name: 'Monica', 
        surname: 'Bellucci', 
        age: '58', 
        company_name: 'Dolce & Gabbana'
    },	
    { 
        id: 5, 
        person_name: 'Steve', 
        surname: 'Jobs', 
        age: '56', 
        company_name: 'Apple'
    },
    { 
        id: 6, 
        person_name: 'Bill', 
        surname: 'Gates', 
        age: '67', 
        company_name: 'Microsoft'
    },
    { 
        id: 7, 
        person_name: 'Elon', 
        surname: 'Musk', 
        age: '52', 
        company_name: 'Tesla'
    },
    { 
        id: 8, 
        person_name: 'Tim', 
        surname: 'Cook', 
        age: '62', 
        company_name: 'Apple'
    },
    { 
        id: 9, 
        person_name: 'Gordon ', 
        surname: 'Ramsay', 
        age: '56', 
        company_name: 'Gordon Ramsay Holdings Ltd.'
    },
    { 
        id: 10, 
        person_name: 'Tina', 
        surname: 'Turner', 
        age: '84', 
        company_name: 'Virgin Records'
    },
];
// Creating a variables for handing the JavaScript
var tableEntry = document.querySelector('tbody');
const id = "#search-id";
const search_person_name = "#search-person_name";
const surname = "#search-surname";
const search_age = "#search-age";
const company_name = "#search-company_name";
// Handle the table
const sorting_table_data = "#sorting_table_data";
// Here is a method to fileter the data
function FilterData(variable_name, sorting_table_data) {
    $(variable_name).on("keyup", function() {
        var idValue = $(id).val().trim();
        var search_person_nameValue = $(search_person_name).val().trim();
        var surnameValue = $(surname).val().trim();
        var search_ageValue = $(search_age).val().trim();
        var company_nameValue = $(company_name).val().trim();
        
        $(sorting_table_data + ">tbody>tr").each(function() {
            var row = $(this);
            var showRow = true;
            var tdValues = [
                idValue,
                search_person_nameValue,
                surnameValue,
                search_ageValue,
                company_nameValue
            ];
            for (var j = 0; j < tdValues.length; j++) {
                var searchValue = tdValues[j];
                var cellText = row.find("td:eq(" + j + ")").text().toLowerCase();
                
                if (searchValue !== "" && !cellText.includes(searchValue.toLowerCase())) {
                    showRow = false;
                    break;
                }
            }
            if (showRow)
                row.show();
            else
                row.hide();
        });
    });
}

//Filter ID
FilterData(id, sorting_table_data);
//Filter person name
FilterData(search_person_name, sorting_table_data);
//Filter surname
FilterData(surname, sorting_table_data);
//Filter age
FilterData(search_age, sorting_table_data);
//Filter company name
FilterData(company_name, sorting_table_data);

// Export to CSV file:
function exportToCSV() {
    var sorting_table_data = document.querySelector("#sorting_table_data");
    var rows = sorting_table_data.querySelectorAll("tbody>tr");
    var filteredData = [];

    // Add new row to filteredData
    var newRow = [
        'ID', 
        'Person name', 
        'Surname', 
        'Age', 
        'Company name'
    ];
    filteredData.push(newRow);

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== "none") {
            var row = [];
            rows[i].querySelectorAll("td").forEach(function(cell) {
                row.push(cell.innerText);
            });
            filteredData.push(row);
        }
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    filteredData.forEach(function(rowArray) {
        csvContent += rowArray.join(",") + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AnalizaTabel.csv");
    document.body.appendChild(link);
    link.click();
}

// Export to Excel file:
function exportToExcel() {
    var sorting_table_data = document.querySelector("#sorting_table_data");
    var rows = sorting_table_data.querySelectorAll("tbody>tr");
    var filteredData = [];
  
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== "none") {
            filteredData.push(rows[i]);
        }
    }
  
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.table_to_sheet(sorting_table_data);
  
    // Adding a new row to the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [[
        'ID', 
        'Person name', 
        'Surname', 
        'Age', 
        'Company name'
    ]]);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    var excelContent = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  
    var blob = new Blob([s2ab(excelContent)], { type: "application/octet-stream" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AnalizaTabel.xlsx";
    link.click();
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
}

// The implementation of the indexedDB library
window.onload = function(){
    window.indexedDB = window.indexedDB || 
        window.mozIndexedDB             ||
        window.webkitIndexedDB          || 
        window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || 
        window.webkitIDBTransaction               || 
        window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || 
        window.webkitIDBKeyRange            || 
        window.msIDBKeyRange;

    var DBOpenRequest = window.indexedDB.open('DataList', 1);

    DBOpenRequest.onsuccess = function(event) {
        db = DBOpenRequest.result;
        populateData();
    };
  
    DBOpenRequest.onupgradeneeded = function(event) { 
        var db = event.target.result;
        
        db.onerror = function(event) {
            console.log('Error with loading data.');
        };
        
        var objectStore = db.createObjectStore('DataList', { keyPath: 'id' }); 
        objectStore.createIndex('person_name', 'person_name'); 
        objectStore.createIndex('surname', 'surname');
        objectStore.createIndex('age', 'age');
        objectStore.createIndex('company_name', 'company_name');
    };
    
    function populateData() {
        var transaction = db.transaction(['DataList'], 'readwrite');
        var objectStore = transaction.objectStore('DataList');
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
                if(activeIndex == "Data Umowy")
                    displayDataByIndex(person_name);
                else if(activeIndex == "surname")
                    displayDataByIndex(surname);
                else if(activeIndex == "age")
                    displayDataByIndex(age);
                else if(activeIndex == "company_name")
                    displayDataByIndex(company_name);
            }
        }
    }

    function displayDataByKey(){
        tableEntry.innerHTML = '';
        var transaction = db.transaction(['DataList'], 'readonly');
        var objectStore = transaction.objectStore('DataList');

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                var tableRow = document.createElement('tr');
                tableRow.innerHTML =  '<td>' + cursor.value.id      + '</td>'
                                    + '<td>' + cursor.value.person_name  + '</td>'
                                    + '<td>' + cursor.value.surname   + '</td>'
                                    + '<td>' + cursor.value.age  + '</td>'
                                    + '<td>' + cursor.value.company_name + '</td>';
                tableEntry.appendChild(tableRow);  
                cursor.continue();
            }else
                console.log('Entries all displayed.');    
        };
    };

    function displayDataByIndex(activeIndex) {
        tableEntry.innerHTML = '';
        var transaction = db.transaction(['DataList'], 'readonly');
        var objectStore = transaction.objectStore('DataList');

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
     
        myIndex.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                var tableRow = document.createElement('tr');
                tableRow.innerHTML = '<td>' + cursor.value.id + '</td>'
                                + '<td>' + cursor.value.person_name + '</td>'
                                + '<td>' + cursor.value.surname + '</td>'
                                + '<td>' + cursor.value.age + '</td>'
                                + '<td>' + cursor.value.company_name + '</td>';
                tableEntry.appendChild(tableRow);  

                cursor.continue();
            } else
                console.log('Entries all displayed.');    
        };
    };
};
