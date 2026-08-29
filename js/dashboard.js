console.log("🔥 DASHBOARD JS IS RUNNING 🔥");

// ==========================================
// GET DATA FROM LOCAL STORAGE
// ==========================================

const dashboardPatients =
    JSON.parse(localStorage.getItem("patients")) || [];

const dashboardDoctors =
    JSON.parse(localStorage.getItem("doctors")) || [];

const dashboardNurses =
    JSON.parse(localStorage.getItem("nurses")) || [];

const dashboardWards =
    JSON.parse(localStorage.getItem("wards")) || [];


// ==========================================
// DASHBOARD ELEMENTS
// ==========================================

const totalPatients =
    document.getElementById("totalPatients");

const totalDoctors =
    document.getElementById("totalDoctors");

const totalNurses =
    document.getElementById("totalNurses");

const availableBeds =
    document.getElementById("availableBeds");


// ==========================================
// TOTAL PATIENTS
// ==========================================

if (totalPatients) {

    totalPatients.textContent =
        dashboardPatients.length;

}


// ==========================================
// TOTAL DOCTORS
// ==========================================

if (totalDoctors) {

    totalDoctors.textContent =
        dashboardDoctors.length;

}


// ==========================================
// TOTAL NURSES
// ==========================================

if (totalNurses) {

    totalNurses.textContent =
        dashboardNurses.length;

}


// ==========================================
// AVAILABLE BEDS
// ==========================================

let totalAvailableBeds = 0;

dashboardWards.forEach(function (ward) {

    totalAvailableBeds +=
        Number(ward.availableBeds) || 0;

});

if (availableBeds) {

    availableBeds.textContent =
        totalAvailableBeds;

}


// ==========================================
// RECENT PATIENTS
// ==========================================

const recentPatientsBody =
    document.getElementById(
        "recentPatientsBody"
    );


if (recentPatientsBody) {

    recentPatientsBody.innerHTML = "";


    const recentPatients =
        dashboardPatients
            .slice(-4)
            .reverse();


    // NO PATIENTS

    if (recentPatients.length === 0) {

        recentPatientsBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center; padding:30px;"
                >

                    No patients found 🔍

                </td>

            </tr>

        `;

    }


    // PATIENTS FOUND

    else {

        recentPatients.forEach(function (patient) {

            const row =
                document.createElement("tr");


            const name =
                patient.name || "Unknown";


            const initials =
                getInitials(name);


            const status =
                patient.status || "Active";


            let statusClass =
                "active-status";


            if (
                status.toLowerCase() ===
                "pending"
            ) {

                statusClass =
                    "pending-status";

            }


            if (
                status.toLowerCase() ===
                "discharged"
            ) {

                statusClass =
                    "completed-status";

            }


            row.innerHTML = `

                <td>

                    <div class="patient-info">

                        <div class="patient-avatar">

                            ${initials}

                        </div>

                        <div>

                            <strong>
                                ${name}
                            </strong>

                            <small>
                                ${patient.id || "-"}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${patient.age || "-"}
                </td>


                <td>
                    ${patient.gender || "-"}
                </td>


                <td>
                    ${patient.doctor || "-"}
                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${status}

                    </span>

                </td>

            `;


            recentPatientsBody.appendChild(row);

        });

    }

}


// ==========================================
// GET INITIALS
// ==========================================

function getInitials(name) {

    if (!name) {

        return "PT";

    }


    const words =
        name.trim().split(/\s+/);


    if (words.length >= 2) {

        return (

            words[0].charAt(0) +

            words[1].charAt(0)

        ).toUpperCase();

    }


    return name
        .substring(0, 2)
        .toUpperCase();

}


console.log("✅ Dashboard loaded successfully!");

console.log(
    "Patients:",
    dashboardPatients
);

console.log(
    "Doctors:",
    dashboardDoctors
);

console.log(
    "Nurses:",
    dashboardNurses
);

console.log(
    "Wards:",
    dashboardWards
);



// ==========================================
// ROLE-BASED SIDEBAR
// ==========================================

const userRole = localStorage.getItem("userRole");

const sidebarItems = document.querySelectorAll(".sidebar-menu .menu-item");

sidebarItems.forEach(function (item) {

    const text = item.textContent.trim().toLowerCase();

    // ------------------------------------------
    // DOCTOR
    // ------------------------------------------

    if (userRole === "doctor") {

        // Doctor can access:
        // Dashboard
        // Patients
        // Appointments

        if (
            text.includes("nurses") ||
            text.includes("wards") ||
            text.includes("reports")
        ) {

            item.style.display = "none";

        }

    }


    // ------------------------------------------
    // NURSE
    // ------------------------------------------

    if (userRole === "nurse") {

        // Nurse can access:
        // Dashboard
        // Patients
        // Wards
        // Appointments

        if (
            text.includes("doctors") ||
            text.includes("reports")
        ) {

            item.style.display = "none";

        }

    }


    // ------------------------------------------
    // PATIENT
    // ------------------------------------------

    if (userRole === "patient") {

        // Patient can access:
        // Dashboard
        // Appointments

        if (
            text.includes("doctors") ||
            text.includes("nurses") ||
            text.includes("wards") ||
            text.includes("reports")
        ) {

            item.style.display = "none";

        }

    }

});