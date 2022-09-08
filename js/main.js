async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function store() { 
    await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        window.localStorage.setItem(tab.title, tab.url);
        retrieveRecords()

    });
}

var keys = []

function retrieveRecords() { //retrieves items in the localStorage
    keys = []
    $('.url-list').html("");
    expc = ['length', 'getItem', 'clear', 'key', 'removeItem', 'setItem']
    i = 0
    for (var key in localStorage) {
        keys.push(key)
        if (!expc.includes(key)) {
            $('.url-list').append(`<h6><a class="url-node" href='${window.localStorage.getItem(key)}'>${key}</a></h6><button id='${i}' class='btn-delete btn btn-warning btn-sm'>Delete</button><br><hr>`);
        }
        i++
    }
    $('.url-node').on('click', function () {
        window.open($(this).attr('href'))
    });
    $('.btn-delete').on('click', function () {
        if (confirm("Do you want remove this item?")){
            removeItem($(this).attr('id'))
            retrieveRecords()
        }
    });
}

function removeItem(id) { //deletes item from localStorage
    localStorage.removeItem(keys[id]) //passes key to the removeItem method
}

function clearStorage(){ //clears the entire localStorage
    if(confirm("Do you want to clear all data?")){
        localStorage.clear()
    }
}


$('.save-url').on('click', function () {
    store()
});

$('.clear-url').on('click', function () {
    clearStorage()
    retrieveRecords()
});

$(document).ready(function () {
    retrieveRecords()
});

