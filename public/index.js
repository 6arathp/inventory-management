document.addEventListener('DOMContentLoaded', async function () {
    showSpinner()
    await fetch("/getItems")
        .then(res => res.json())
        .then(data => loadTable(data))
    await fetch("/getLog")
        .then(res => res.json())
        .then(data => loadLog(data))

        document.querySelector("#item-name").value = ""
        document.querySelector("#item-category").value = ""
        document.querySelector("#item-quantity").value = ""
    hideSpinner ()
})

function showSpinner() {
    document.querySelector("#spinner-div").style.display = "flex"
    document.querySelector("#spinner-img").style.display = "block"
}

function hideSpinner () {
    document.querySelector("#spinner-div").style.display = "none"
    document.querySelector("#spinner-img").style.display = "none"
}


function loadTable (data) {
    const table = document.querySelector('#table tbody')

    if (data.length === 0) {
        table.innerHTML =   `<tr>
                                <td colspan='6' style="text-align: center; font-size: 23px">
                                    NO DATA
                                </td>
                            </tr>`
        return
    }

    let temp = ""
    data.forEach(function ({ id, name, category, quantity }) {
        temp += `<tr>`
        temp += `<td>${id}</td>`
        temp += `<td>${name}</td>`
        temp += `<td>${category}</td>`
        temp += `<td>${quantity}</td>`
        temp += `</tr>`

    });

    table.innerHTML = temp
}

function loadLog (data) {
    const table = document.querySelector('#log-table tbody')

    if (data.length === 0) {
        table.innerHTML =   `<tr>
                                <td colspan='6' style="text-align: center; font-size: 23px">
                                    NO DATA
                                </td>
                            </tr>`
        return
    }
    let temp = ""
    data.forEach(function ({ id, name, category, quantity, actions, time }) {
        temp += `<tr>`
        temp += `<td>${id}</td>`
        temp += `<td>${name}</td>`
        temp += `<td>${category}</td>`
        temp += `<td>${quantity}</td>`
        temp += `<td>${actions}</td>`
        temp += `<td>${new Date(time).toLocaleString()}</td>`
        temp += `</tr>`

    });

    table.innerHTML = temp
}

function insertLogRow (data) {
    const table = document.querySelector('#log-table tbody');
    const { id, name, category, quantity, actions, time } = data[0]
    let temp = ""
    temp += `<tr>`
    temp += `<td>${id}</td>`
    temp += `<td>${name}</td>`
    temp += `<td>${category}</td>`
    temp += `<td>${quantity}</td>`
    temp += `<td>${actions}</td>`
    temp += `<td>${new Date(time).toLocaleString()}</td>`
    temp += `</tr>`

    const row = table.insertRow()
    row.innerHTML = temp
}

function updateTable (data) {
    const table = document.querySelector('#table tbody');
    table.innerHTML = ""
    loadTable(data)
    
    
    // const { id, name, category, quantity } = data[0]
    // let temp = ""
    // temp += `<tr>`
    // temp += `<td>${id}</td>`
    // temp += `<td>${name}</td>`
    // temp += `<td>${category}</td>`
    // temp += `<td>${quantity}</td>`
    // temp += `</tr>`

    // const row = table.insertRow()
    // row.innerHTML = temp    
}

const addBtn = document.querySelector("#add-btn")
addBtn.onclick = async function () {
    
    itemName = document.querySelector("#item-name").value
    if (itemName == null || itemName == '') {
        alert(`Please Enter Name`)
        return
    }
    itemCategory = document.querySelector("#item-category").value
    if (itemCategory == null || itemCategory == '') {
        alert(`Please Enter Category`)
        return
    }
    itemQuantity = document.querySelector("#item-quantity").value
    if (itemQuantity == null || itemQuantity == '') {
        alert(`Please enter Quantity`)
        return
    }
    if (!document.querySelector('input[name="action"]:checked'))
    {
        alert("Please choose ADD/REMOVE operation")
        return
    }
    itemAction = document.querySelector('input[name="action"]:checked').value
    

    
    showSpinner()
    response = await fetch("/update", {
        method: "POST",
        body: JSON.stringify({
            name: itemName,
            category: itemCategory,
            quantity: itemQuantity,
            action: itemAction
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    // await fetch("/getTableRow")
    // .then(res => res.json())
    // .then(data => insertTableRow([data]))
    if (response.status == 201) {
        await fetch("/getItems")
            .then(res => res.json())
            .then(data => loadTable(data))

        await fetch("/getLogRow")
            .then(res => res.json())
            .then(data => {
                const table = document.querySelector('#log-table tbody');
                if (table.innerHTML.includes('NO DATA'))
                    table.innerHTML = ""
                insertLogRow([data])
            })
    } else if (response.status == 365) {
        alert("Cannot Remove: Item does not exist")
    }
    hideSpinner()
}

const truncateBtn = document.querySelector("#truncate-btn")
truncateBtn.onclick = async function () {
    showSpinner()
    response = await fetch("/truncateAll")
    if (response.status == 201) {
        await fetch("/getItems")
            .then(res => res.json())
            .then(data => loadTable(data))

        await fetch("/getLog")
            .then(res => res.json())
            .then(data => loadLog(data))
    }
    hideSpinner()
}










// export function addRow () {

//     let table = document.getElementById("log-table");

//     let row = document.createElement("tr")
    
//     let c1 = document.createElement("td")
//     let c2 = document.createElement("td")
//     let c3 = document.createElement("td")
//     let c4 = document.createElement("td")
//     let c5 = document.createElement("td")
//     let c6 = document.createElement("td")

//     c1.innerText = "Elon"
//     c2.innerText = "42"
//     c3.innerText = "Houston"
//     c4.innerText = "C++"
//     c5.innerText = "C++"
//     c6.innerText = "C++"
    
//     row.appendChild(c1);
//     row.appendChild(c2);
//     row.appendChild(c3);
//     row.appendChild(c4);
//     row.appendChild(c5);
//     row.appendChild(c6);
    
//     // Append row to table body
//     table.appendChild(row)
// }