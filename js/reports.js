console.log("Reports Management Loaded!");


// ==========================================
// GET DATA FROM LOCAL STORAGE
// ==========================================

function getData(key) {

    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    try {

        const parsedData = JSON.parse(data);

        return Array.isArray(parsedData)
            ? parsedData
            : [];

    } catch (error) {

        console.error("Error loading " + key, error);

        return [];

    }

}


// ==========================================
// LOAD BASIC REPORTS
// ==========================================

function loadBasicReports() {

    const patients = getData("patients");
    const doctors = getData("doctors");
    const nurses = getData("nurses");
    const wards = getData("wards");


    const patientsElement =
        document.getElementById("reportPatients");

    const doctorsElement =
        document.getElementById("reportDoctors");

    const nursesElement =
        document.getElementById("reportNurses");

    const wardsElement =
        document.getElementById("reportWards");


    if (patientsElement) {

        patientsElement.textContent =
            patients.length;

    }


    if (doctorsElement) {

        doctorsElement.textContent =
            doctors.length;

    }


    if (nursesElement) {

        nursesElement.textContent =
            nurses.length;

    }


    if (wardsElement) {

        wardsElement.textContent =
            wards.length;

    }

}


// ==========================================
// APPOINTMENT REPORT
// ==========================================

function loadAppointmentReports() {

    const appointments =
        getData("appointments");


    const total =
        appointments.length;


    const pending =
        appointments.filter(function (appointment) {

            return appointment.status === "Pending";

        }).length;


    const completed =
        appointments.filter(function (appointment) {

            return appointment.status === "Completed";

        }).length;


    const cancelled =
        appointments.filter(function (appointment) {

            return appointment.status === "Cancelled";

        }).length;


    const totalElement =
        document.getElementById("reportAppointments");

    const pendingElement =
        document.getElementById("reportPending");

    const completedElement =
        document.getElementById("reportCompleted");

    const cancelledElement =
        document.getElementById("reportCancelled");


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (cancelledElement) {

        cancelledElement.textContent =
            cancelled;

    }

}


// ==========================================
// BED REPORT
// ==========================================

function loadBedReports() {

    const wards =
        getData("wards");


    let totalBeds = 0;

    let availableBeds = 0;


    wards.forEach(function (ward) {

        totalBeds +=
            Number(ward.totalBeds) || 0;

        availableBeds +=
            Number(ward.availableBeds) || 0;

    });


    let occupiedBeds =
        totalBeds - availableBeds;


    if (occupiedBeds < 0) {

        occupiedBeds = 0;

    }


    const totalBedsElement =
        document.getElementById("reportTotalBeds");

    const availableBedsElement =
        document.getElementById("reportAvailableBeds");

    const occupiedBedsElement =
        document.getElementById("reportOccupiedBeds");


    if (totalBedsElement) {

        totalBedsElement.textContent =
            totalBeds;

    }


    if (availableBedsElement) {

        availableBedsElement.textContent =
            availableBeds;

    }


    if (occupiedBedsElement) {

        occupiedBedsElement.textContent =
            occupiedBeds;

    }

}


// ==========================================
// REFRESH ALL REPORTS
// ==========================================

function refreshReports() {

    loadBasicReports();

    loadAppointmentReports();

    loadBedReports();

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshReports();

    }
);


// ==========================================
// FINAL CONSOLE CHECK
// ==========================================

console.log(
    "Patients:",
    getData("patients").length
);

console.log(
    "Doctors:",
    getData("doctors").length
);

console.log(
    "Nurses:",
    getData("nurses").length
);

console.log(
    "Wards:",
    getData("wards").length
);

console.log(
    "Appointments:",
    getData("appointments").length
);

// ==========================================
// APPOINTMENT CHART
// ==========================================

function createAppointmentChart() {

    const chartElement =
        document.getElementById("appointmentChart");

    if (!chartElement) {
        return;
    }


    const appointments =
        getData("appointments");


    const pending =
        appointments.filter(function (appointment) {

            return appointment.status === "Pending";

        }).length;


    const completed =
        appointments.filter(function (appointment) {

            return appointment.status === "Completed";

        }).length;


    const cancelled =
        appointments.filter(function (appointment) {

            return appointment.status === "Cancelled";

        }).length;


    const scheduled =
        appointments.filter(function (appointment) {

            return appointment.status === "Scheduled";

        }).length;


    new Chart(chartElement, {

        type: "doughnut",

        data: {

            labels: [
                "Scheduled",
                "Pending",
                "Completed",
                "Cancelled"
            ],

            datasets: [{

                data: [
                    scheduled,
                    pending,
                    completed,
                    cancelled
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ==========================================
// BED AVAILABILITY CHART
// ==========================================

function createBedChart() {

    const chartElement =
        document.getElementById("bedChart");

    if (!chartElement) {
        return;
    }


    const wards =
        getData("wards");


    let totalBeds = 0;

    let availableBeds = 0;


    wards.forEach(function (ward) {

        totalBeds +=
            Number(ward.totalBeds) || 0;

        availableBeds +=
            Number(ward.availableBeds) || 0;

    });


    let occupiedBeds =
        totalBeds - availableBeds;


    if (occupiedBeds < 0) {

        occupiedBeds = 0;

    }


    new Chart(chartElement, {

        type: "doughnut",

        data: {

            labels: [
                "Available Beds",
                "Occupied Beds"
            ],

            datasets: [{

                data: [
                    availableBeds,
                    occupiedBeds
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ==========================================
// LOAD CHARTS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createAppointmentChart();

        createBedChart();

    }
);