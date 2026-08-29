console.log("Appointment Management Loaded!");

// ==========================================
// APPOINTMENT FORM & TABLE
// ==========================================

const appointmentForm = document.getElementById("appointmentForm");
const appointmentsTableBody = document.getElementById("appointmentsTableBody");
const appointmentSearch = document.getElementById("appointmentSearch");


// ==========================================
// LOAD APPOINTMENTS
// ==========================================

let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];

let editingAppointmentId = null;


// ==========================================
// SAVE APPOINTMENTS
// ==========================================

function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

}


// ==========================================
// GENERATE APPOINTMENT ID
// ==========================================

function generateAppointmentId() {

    let maxNumber = 1000;

    appointments.forEach(function (appointment) {

        if (!appointment.id) {
            return;
        }

        const number = parseInt(
            appointment.id.replace("APT-", "")
        );

        if (!isNaN(number) && number > maxNumber) {
            maxNumber = number;
        }

    });

    return "APT-" + (maxNumber + 1);

}


// ==========================================
// STATUS CLASS
// ==========================================

function getAppointmentStatusClass(status) {

    if (status === "Scheduled") {
        return "active-status";
    }

    if (status === "Completed") {
        return "completed-status";
    }

    if (status === "Cancelled") {
        return "cancelled-status";
    }

    return "pending-status";

}


// ==========================================
// DISPLAY APPOINTMENTS
// ==========================================

function displayAppointments(appointmentList = appointments) {

    if (!appointmentsTableBody) {
        return;
    }

    appointmentsTableBody.innerHTML = "";


    // NO APPOINTMENTS

    if (appointmentList.length === 0) {

        appointmentsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center; padding:40px;"
                >
                    No appointments found 🔍
                </td>
            </tr>
        `;

        return;
    }


    // DISPLAY

    appointmentList.forEach(function (appointment) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <!-- PATIENT -->

            <td>

                <div class="patient-info">

                    <div class="patient-avatar">
                        🧑‍⚕️
                    </div>

                    <div>

                        <strong>
                            ${appointment.patient}
                        </strong>

                        <small>
                            ${appointment.id}
                        </small>

                    </div>

                </div>

            </td>


            <!-- DOCTOR -->

            <td>
                ${appointment.doctor}
            </td>


            <!-- DATE -->

            <td>
                ${appointment.date}
            </td>


            <!-- TIME -->

            <td>
                ${appointment.time}
            </td>


            <!-- REASON -->

            <td>
                ${appointment.reason}
            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="status ${appointment.statusClass}"
                >
                    ${appointment.status}
                </span>

            </td>


            <!-- ACTIONS -->

            <td>

                <button
                    type="button"
                    class="action-btn view-appointment-btn"
                    data-id="${appointment.id}"
                    title="View Appointment"
                >
                    👁️
                </button>


                <button
                    type="button"
                    class="action-btn edit-appointment-btn"
                    data-id="${appointment.id}"
                    title="Edit Appointment"
                >
                    ✏️
                </button>


                <button
                    type="button"
                    class="action-btn delete-appointment-btn"
                    data-id="${appointment.id}"
                    title="Delete Appointment"
                >
                    🗑️
                </button>

            </td>

        `;


        appointmentsTableBody.appendChild(row);

    });

}


// ==========================================
// ADD / EDIT APPOINTMENT
// ==========================================

if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // GET VALUES

            const patient =
                document
                    .getElementById("appointmentPatient")
                    .value
                    .trim();


            const doctor =
                document
                    .getElementById("appointmentDoctor")
                    .value
                    .trim();


            const date =
                document
                    .getElementById("appointmentDate")
                    .value;


            const time =
                document
                    .getElementById("appointmentTime")
                    .value;


            const reason =
                document
                    .getElementById("appointmentReason")
                    .value
                    .trim();


            const status =
                document
                    .getElementById("appointmentStatus")
                    .value;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (
                patient === "" ||
                doctor === "" ||
                date === "" ||
                time === "" ||
                reason === "" ||
                status === ""
            ) {

                alert("Please fill all fields!");

                return;
            }


            // ==========================================
            // EDIT APPOINTMENT
            // ==========================================

            if (editingAppointmentId !== null) {

                const appointmentIndex =
                    appointments.findIndex(
                        function (appointment) {

                            return appointment.id === editingAppointmentId;

                        }
                    );


                if (appointmentIndex !== -1) {

                    appointments[appointmentIndex].patient =
                        patient;

                    appointments[appointmentIndex].doctor =
                        doctor;

                    appointments[appointmentIndex].date =
                        date;

                    appointments[appointmentIndex].time =
                        time;

                    appointments[appointmentIndex].reason =
                        reason;

                    appointments[appointmentIndex].status =
                        status;

                    appointments[appointmentIndex].statusClass =
                        getAppointmentStatusClass(status);


                    saveAppointments();

                    displayAppointments();


                    appointmentForm.reset();

                    editingAppointmentId = null;


                    const modalElement =
                        document.getElementById(
                            "addAppointmentModal"
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
                        "Appointment updated successfully!"
                    );

                    return;

                }

            }


            // ==========================================
            // CREATE NEW APPOINTMENT
            // ==========================================

            const newAppointment = {

                id:
                    generateAppointmentId(),

                patient:
                    patient,

                doctor:
                    doctor,

                date:
                    date,

                time:
                    time,

                reason:
                    reason,

                status:
                    status,

                statusClass:
                    getAppointmentStatusClass(status)

            };


            // ADD

            appointments.push(newAppointment);


            // SAVE

            saveAppointments();


            // DISPLAY

            displayAppointments();


            // RESET

            appointmentForm.reset();


            // CLOSE MODAL

            const modalElement =
                document.getElementById(
                    "addAppointmentModal"
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
                "Appointment added successfully!"
            );

        }
    );

}


// ==========================================
// VIEW APPOINTMENT
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const viewButton =
            event.target.closest(
                ".view-appointment-btn"
            );


        if (!viewButton) {
            return;
        }


        const appointmentId =
            viewButton.dataset.id;


        const appointment =
            appointments.find(
                function (item) {

                    return item.id === appointmentId;

                }
            );


        if (!appointment) {

            alert("Appointment not found!");

            return;
        }


        // FILL VIEW MODAL

        document.getElementById(
            "viewAppointmentPatient"
        ).textContent =
            appointment.patient;


        document.getElementById(
            "viewAppointmentId"
        ).textContent =
            appointment.id;


        document.getElementById(
            "viewAppointmentDoctor"
        ).textContent =
            appointment.doctor;


        document.getElementById(
            "viewAppointmentDate"
        ).textContent =
            appointment.date;


        document.getElementById(
            "viewAppointmentTime"
        ).textContent =
            appointment.time;


        document.getElementById(
            "viewAppointmentReason"
        ).textContent =
            appointment.reason;


        const statusElement =
            document.getElementById(
                "viewAppointmentStatus"
            );


        statusElement.textContent =
            appointment.status;


        statusElement.className =
            "status " +
            appointment.statusClass;


        // OPEN MODAL

        const modalElement =
            document.getElementById(
                "viewAppointmentModal"
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
// EDIT APPOINTMENT
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                ".edit-appointment-btn"
            );


        if (!editButton) {
            return;
        }


        const appointmentId =
            editButton.dataset.id;


        const appointment =
            appointments.find(
                function (item) {

                    return item.id === appointmentId;

                }
            );


        if (!appointment) {

            alert("Appointment not found!");

            return;
        }


        // SET EDITING ID

        editingAppointmentId =
            appointment.id;


        // FILL FORM

        document.getElementById(
            "appointmentPatient"
        ).value =
            appointment.patient;


        document.getElementById(
            "appointmentDoctor"
        ).value =
            appointment.doctor;


        document.getElementById(
            "appointmentDate"
        ).value =
            appointment.date;


        document.getElementById(
            "appointmentTime"
        ).value =
            appointment.time;


        document.getElementById(
            "appointmentReason"
        ).value =
            appointment.reason;


        document.getElementById(
            "appointmentStatus"
        ).value =
            appointment.status;


        // CHANGE TITLE

        document.getElementById(
            "addAppointmentModalLabel"
        ).textContent =
            "Edit Appointment";


        // CHANGE BUTTON

        document.getElementById(
            "appointmentSubmitBtn"
        ).textContent =
            "Update Appointment";


        // OPEN MODAL

        const modalElement =
            document.getElementById(
                "addAppointmentModal"
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
// DELETE APPOINTMENT
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-appointment-btn"
            );


        if (!deleteButton) {
            return;
        }


        const appointmentId =
            deleteButton.dataset.id;


        const appointment =
            appointments.find(
                function (item) {

                    return item.id === appointmentId;

                }
            );


        if (!appointment) {
            return;
        }


        const confirmDelete =
            confirm(
                `Are you sure you want to delete appointment for ${appointment.patient}?`
            );


        if (!confirmDelete) {
            return;
        }


        // REMOVE

        appointments =
            appointments.filter(
                function (item) {

                    return item.id !== appointmentId;

                }
            );


        // SAVE

        saveAppointments();


        // UPDATE TABLE

        displayAppointments();


        alert(
            "Appointment deleted successfully!"
        );

    }
);


// ==========================================
// SEARCH APPOINTMENTS
// ==========================================

if (appointmentSearch) {

    appointmentSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                appointmentSearch.value
                    .toLowerCase()
                    .trim();


            const filteredAppointments =
                appointments.filter(
                    function (appointment) {

                        return (

                            appointment.patient
                                .toLowerCase()
                                .includes(searchValue) ||

                            appointment.doctor
                                .toLowerCase()
                                .includes(searchValue) ||

                            appointment.date
                                .toLowerCase()
                                .includes(searchValue) ||

                            appointment.reason
                                .toLowerCase()
                                .includes(searchValue) ||

                            appointment.status
                                .toLowerCase()
                                .includes(searchValue) ||

                            appointment.id
                                .toLowerCase()
                                .includes(searchValue)

                        );

                    }
                );


            displayAppointments(
                filteredAppointments
            );

        }
    );

}


// ==========================================
// RESET MODAL
// ==========================================

const addAppointmentModal =
    document.getElementById(
        "addAppointmentModal"
    );


if (addAppointmentModal) {

    addAppointmentModal.addEventListener(
        "hidden.bs.modal",
        function () {

            editingAppointmentId = null;


            if (appointmentForm) {
                appointmentForm.reset();
            }


            document.getElementById(
                "addAppointmentModalLabel"
            ).textContent =
                "Add New Appointment";


            document.getElementById(
                "appointmentSubmitBtn"
            ).textContent =
                "Add Appointment";

        }
    );

}


// ==========================================
// LOAD APPOINTMENTS
// ==========================================

displayAppointments();