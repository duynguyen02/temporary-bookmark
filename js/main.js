const url_storage_key = "tj-temporary-bookmark"

const url_storage_struct = {
    "urls_list": [

    ]
}

var url_storage

var urls_list

var current_url

var current_title

var current_page_status


/**
 * 
 * get current tab
 */
async function getCurrentTab(onTabListener) {
    await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        onTabListener(tab)
    });
}

/**
 * check if page was saved
 */
function isContainPage(url) {

    for (i of urls_list) {
        if (i.unique_url === url) {
            return true
        }
    }
    return false
}


/**
 * initialize variables
 */
function init() {
    let url_storage_temp = localStorage.getItem(url_storage_key)

    url_storage = (url_storage_temp == null) ? url_storage_struct : JSON.parse(url_storage_temp)

    urls_list = url_storage.urls_list
}


function getPageStatus() {

    function setPageStatus(status) {
        statusString = (status) ? '<span style="color: green;">✔</span></p>' : '<span style="color: red;">✗</span></p>'

        $('.page-status').html(
            `<p>Page status: ${statusString}</p>`
        );

    }

    getCurrentTab((tab) => {
        current_title = tab.title
        current_url = tab.url
        current_page_status = isContainPage(tab.url)
        setPageStatus(current_page_status)
        saveelementSetup(current_page_status)
        addRecordsToUI(urls_list)


    })
}

function saveelementSetup(current_page_status) {
    if (current_page_status) {
        $('.save-url').prop('disabled', true);
    }
    else {
        $('.save-url').prop('disabled', false);
    }
}


/**
 * Add data to UI
 */
function retrieveRecords() { //retrieves items in the localStorage
    init()
    getPageStatus()
}

function addRecordsToUI(data) {
    $('.url-list').html("");
    count = 0
    data.forEach(element => {
        console.log(current_page_status);
        is_current_page = (element.unique_url === current_url) ? "<span style='color:red;'>[★]</span>" : ""
        $('.url-list').append(
            `<h6><a class="url-node" href='${element.unique_url}'>${element.title}${is_current_page}</a></h6><button id='${element.unique_url}' class='btn-delete btn btn-warning btn-sm'>Delete</button><br><hr>`
        )

        count++

    });

    $('.url-node').on('click', function () {
        window.open($(this).attr('href'))
    });
    $('.btn-delete').on('click', function () {
        if (confirm("Do you want remove this item?")) {
            removeItem($(this).attr('id'))
            retrieveRecords()
        }
    });
}


/**
 * deletes item from url_storage
 */
function removeItem(id) {

    // remove url from user choose in urls_list
    urls_list = urls_list.filter(function (item) {
        return item.unique_url !== id
    })


    // add new urls_list to url_storage
    url_storage.urls_list = urls_list

    localStorage.setItem(url_storage_key, JSON.stringify(url_storage))

    retrieveRecords()


}

/**
 * Clear all data in storage
 */
function clearStorage() { //clears the entire localStorage
    if (confirm("Do you want to clear all data?")) {
        localStorage.setItem(url_storage_key, JSON.stringify(url_storage_struct))
        retrieveRecords()
    }
}



function elementSetup() {

    $('.save-url').on('click', function () {

        if (!current_page_status) {
            temp_model = {
                "unique_url": current_url,
                "title": current_title,
                "time": new Date().toLocaleString()
            }

            urls_list.push(temp_model)

            urls_list.reverse(function (a, b) {
                return (Date(a.time) - Date(b.time));
            });


            url_storage.urls_list = urls_list

            localStorage.setItem(url_storage_key, JSON.stringify(url_storage))

            retrieveRecords()
        }

    })

    $('.input-search').on('input', function () {
        let query = $(this).val().toLowerCase()
        temp_list = urls_list.filter(function (item) {
            return item.title.toLowerCase().includes(query)
        })

        addRecordsToUI(temp_list)

    });

    $('.clear-url').on('click', function () {
        clearStorage()
        retrieveRecords()
    });

    $('.btn-import').on('click', function () {
        alert("Comming soon!")
    });

    $('.btn-export').on('click', function () {
        alert("Comming soon!")
    });
}


/**
 * Main Function
 */
$(document).ready(function () {
    retrieveRecords()
    elementSetup()
});

