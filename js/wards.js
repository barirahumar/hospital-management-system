console.log("Ward Management Loaded!");

// ==========================================
// WARD FORM & TABLE
// ==========================================

const wardForm = document.getElementById("wardForm");
const wardsTableBody = document.getElementById("wardsTableBody");
const wardSearch = document.getElementById("wardSearch");

// ==========================================
// LOAD WARDS FROM LOCAL STORAGE
// ==========================================

let wards = JSON.parse(localStorage.getItem("wards")) || [];

let editingWardId = null;


// ==========================================
// SAVE WARDS
// ==========================================

function saveWards() {

    localStorage.setItem(
        "wards",
        JSON.stringify(wards)
    );

}


// ==========================================
// GENERATE WARD ID
// ==========================================

function generateWardId() {

    let maxNumber = 1000;

    wards.forEach(function (ward) {

        if (!ward.id) {
            return;
        }

        const number =
            parseInt(ward.id.replace("WR-", ""));

        if (!isNaN(number) && number > maxNumber) {
            maxNumber = number;
        }

    });

    return "WR-" + (maxNumber + 1);

}


// ==========================================
// GET STATUS CLASS
// ==========================================

function getWardStatusClass(status) {

    if (status === "Available") {
        return "active-status";
    }

    if (status === "Full") {
        return "pending-status";
    }

    return "completed-status";

}


// ==========================================
// DISPLAY WARDS
// ==========================================

function displayWards(wardList = wards) {

    if (!wardsTableBody) {
        return;
    }

    wardsTableBody.innerHTML = "";


    // NO WARDS

    if (wardList.length === 0) {

        wardsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center; padding:40px;"
                >
                    No wards found 🔍
                </td>
            </tr>
        `;

        return;
    }


    // DISPLAY WARDS

    wardList.forEach(function (ward) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <!-- WARD -->

            <td>

                <div class="patient-info">

                    <div class="patient-avatar">
                        🛏️
                    </div>

                    <div>

                        <strong>
                            ${ward.name}
                        </strong>

                        <small>
                            ${ward.id}
                        </small>

                    </div>

                </div>

            </td>


            <!-- TYPE -->

            <td>
                ${ward.type}
            </td>


            <!-- FLOOR -->

            <td>
                ${ward.floor}
            </td>


            <!-- TOTAL BEDS -->

            <td>
                ${ward.totalBeds}
            </td>


            <!-- AVAILABLE BEDS -->

            <td>
                ${ward.availableBeds}
            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="status ${ward.statusClass}"
                >
                    ${ward.status}
                </span>

            </td>


            <!-- ACTIONS -->

            <td>

                <!-- VIEW -->

                <button
                    type="button"
                    class="action-btn view-ward-btn"
                    data-id="${ward.id}"
                    title="View Ward"
                >
                    👁️
                </button>


                <!-- EDIT -->

                <button
                    type="button"
                    class="action-btn edit-ward-btn"
                    data-id="${ward.id}"
                    title="Edit Ward"
                >
                    ✏️
                </button>


                <!-- DELETE -->

                <button
                    type="button"
                    class="action-btn delete-ward-btn"
                    data-id="${ward.id}"
                    title="Delete Ward"
                >
                    🗑️
                </button>

            </td>

        `;


        wardsTableBody.appendChild(row);

    });

}


// ==========================================
// ADD / EDIT WARD
// ==========================================

if (wardForm) {

    wardForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // GET VALUES

            const name =
                document
                    .getElementById("wardName")
                    .value
                    .trim();


            const type =
                document
                    .getElementById("wardType")
                    .value;


            const floor =
                document
                    .getElementById("wardFloor")
                    .value
                    .trim();


            const totalBeds =
                document
                    .getElementById("wardTotalBeds")
                    .value;


            const availableBeds =
                document
                    .getElementById("wardAvailableBeds")
                    .value;


            const status =
                document
                    .getElementById("wardStatus")
                    .value;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (
                name === "" ||
                type === "" ||
                floor === "" ||
                totalBeds === "" ||
                availableBeds === "" ||
                status === ""
            ) {

                alert("Please fill all fields!");

                return;

            }


            const total =
                Number(totalBeds);

            const available =
                Number(availableBeds);


            // AVAILABLE BEDS CANNOT BE MORE THAN TOTAL

            if (available > total) {

                alert(
                    "Available beds cannot be greater than total beds!"
                );

                return;

            }


            // AVAILABLE BEDS CANNOT BE NEGATIVE

            if (available < 0) {

                alert(
                    "Available beds cannot be negative!"
                );

                return;

            }


            // ==========================================
            // EDIT WARD
            // ==========================================

            if (editingWardId !== null) {

                const wardIndex =
                    wards.findIndex(
                        function (ward) {

                            return ward.id === editingWardId;

                        }
                    );


                if (wardIndex !== -1) {

                    wards[wardIndex].name =
                        name;

                    wards[wardIndex].type =
                        type;

                    wards[wardIndex].floor =
                        floor;

                    wards[wardIndex].totalBeds =
                        total;

                    wards[wardIndex].availableBeds =
                        available;

                    wards[wardIndex].status =
                        status;

                    wards[wardIndex].statusClass =
                        getWardStatusClass(status);


                    saveWards();

                    displayWards();


                    wardForm.reset();

                    editingWardId = null;


                    const modalElement =
                        document.getElementById(
                            "addWardModal"
                        );


                    if (modalElement) {

                        const modal =
                            bootstrap.Modal.getInstance(
                                modalElement
                            );


                        if (modal) {
                            modal.hide();
                        }

                    }


                    alert(
                        "Ward updated successfully!"
                    );

                    return;

                }

            }


            // ==========================================
            // CREATE NEW WARD
            // ==========================================

            const newWard = {

                id:
                    generateWardId(),

                name:
                    name,

                type:
                    type,

                floor:
                    floor,

                totalBeds:
                    total,

                availableBeds:
                    available,

                status:
                    status,

                statusClass:
                    getWardStatusClass(status)

            };


            // ADD

            wards.push(newWard);


            // SAVE

            saveWards();


            // DISPLAY

            displayWards();


            // RESET

            wardForm.reset();


            // CLOSE MODAL

            const modalElement =
                document.getElementById(
                    "addWardModal"
                );


            if (modalElement) {

                const modal =
                    bootstrap.Modal.getInstance(
                        modalElement
                    );


                if (modal) {
                    modal.hide();
                }

            }


            alert(
                "Ward added successfully!"
            );

        }
    );

}


// ==========================================
// VIEW WARD
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const viewButton =
            event.target.closest(
                ".view-ward-btn"
            );


        if (!viewButton) {
            return;
        }


        const wardId =
            viewButton.dataset.id;


        const ward =
            wards.find(
                function (item) {

                    return item.id === wardId;

                }
            );


        if (!ward) {

            alert("Ward not found!");

            return;

        }


        // FILL VIEW MODAL

        document.getElementById(
            "viewWardName"
        ).textContent =
            ward.name;


        document.getElementById(
            "viewWardId"
        ).textContent =
            ward.id;


        document.getElementById(
            "viewWardType"
        ).textContent =
            ward.type;


        document.getElementById(
            "viewWardFloor"
        ).textContent =
            ward.floor;


        document.getElementById(
            "viewWardTotalBeds"
        ).textContent =
            ward.totalBeds;


        document.getElementById(
            "viewWardAvailableBeds"
        ).textContent =
            ward.availableBeds;


        const statusElement =
            document.getElementById(
                "viewWardStatus"
            );


        statusElement.textContent =
            ward.status;


        statusElement.className =
            "status " +
            ward.statusClass;


        // OPEN MODAL

        const modalElement =
            document.getElementById(
                "viewWardModal"
            );


        if (modalElement) {

            const modal =
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );

            modal.show();

        }

    }
);


// ==========================================
// EDIT WARD
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                ".edit-ward-btn"
            );


        if (!editButton) {
            return;
        }


        const wardId =
            editButton.dataset.id;


        const ward =
            wards.find(
                function (item) {

                    return item.id === wardId;

                }
            );


        if (!ward) {

            alert("Ward not found!");

            return;

        }


        // SET EDITING ID

        editingWardId =
            ward.id;


        // FILL FORM

        document.getElementById(
            "wardName"
        ).value =
            ward.name;


        document.getElementById(
            "wardType"
        ).value =
            ward.type;


        document.getElementById(
            "wardFloor"
        ).value =
            ward.floor;


        document.getElementById(
            "wardTotalBeds"
        ).value =
            ward.totalBeds;


        document.getElementById(
            "wardAvailableBeds"
        ).value =
            ward.availableBeds;


        document.getElementById(
            "wardStatus"
        ).value =
            ward.status;


        // CHANGE TITLE

        document.getElementById(
            "addWardModalLabel"
        ).textContent =
            "Edit Ward";


        // CHANGE BUTTON

        document.getElementById(
            "wardSubmitBtn"
        ).textContent =
            "Update Ward";


        // OPEN MODAL

        const modalElement =
            document.getElementById(
                "addWardModal"
            );


        if (modalElement) {

            const modal =
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );

            modal.show();

        }

    }
);


// ==========================================
// DELETE WARD
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-ward-btn"
            );


        if (!deleteButton) {
            return;
        }


        const wardId =
            deleteButton.dataset.id;


        const ward =
            wards.find(
                function (item) {

                    return item.id === wardId;

                }
            );


        if (!ward) {
            return;
        }


        const confirmDelete =
            confirm(
                `Are you sure you want to delete ${ward.name}?`
            );


        if (!confirmDelete) {
            return;
        }


        // REMOVE

        wards =
            wards.filter(
                function (item) {

                    return item.id !== wardId;

                }
            );


        // SAVE

        saveWards();


        // UPDATE TABLE

        displayWards();


        alert(
            "Ward deleted successfully!"
        );

    }
);


// ==========================================
// SEARCH WARD
// ==========================================

if (wardSearch) {

    wardSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                wardSearch.value
                    .toLowerCase()
                    .trim();


            const filteredWards =
                wards.filter(
                    function (ward) {

                        return (
                            ward.name
                                .toLowerCase()
                                .includes(searchValue) ||

                            ward.id
                                .toLowerCase()
                                .includes(searchValue) ||

                            ward.type
                                .toLowerCase()
                                .includes(searchValue) ||

                            ward.floor
                                .toLowerCase()
                                .includes(searchValue)
                        );

                    }
                );


            displayWards(
                filteredWards
            );

        }
    );

}


// ==========================================
// RESET MODAL
// ==========================================

const addWardModal =
    document.getElementById(
        "addWardModal"
    );


if (addWardModal) {

    addWardModal.addEventListener(
        "hidden.bs.modal",
        function () {

            editingWardId = null;


            if (wardForm) {
                wardForm.reset();
            }


            document.getElementById(
                "addWardModalLabel"
            ).textContent =
                "Add New Ward";


            document.getElementById(
                "wardSubmitBtn"
            ).textContent =
                "Add Ward";

        }
    );

}


// ==========================================
// LOAD WARDS
// ==========================================

displayWards();