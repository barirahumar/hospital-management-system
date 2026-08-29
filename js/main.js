console.log("Hospital Management System Loaded!");

// ==========================================
// PATIENT MANAGEMENT
// ==========================================

const patientForm = document.getElementById("patientForm");
const patientsTableBody = document.getElementById("patientsTableBody");

const patientSearch = document.getElementById("patientSearch");
const patientFilter = document.getElementById("patientFilter");

// ==========================================
// LOCAL STORAGE
// ==========================================

let patients = JSON.parse(localStorage.getItem("patients")) || [];

// ==========================================
// DISPLAY PATIENTS
// ==========================================

function displayPatients(patientList = patients) {
  if (!patientsTableBody) {
    return;
  }

  // Clear table

  patientsTableBody.innerHTML = "";

  // No patients

  if (patientList.length === 0) {
    patientsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align: center; padding: 40px;"
                >

                    No patients found 🔍

                </td>

            </tr>

        `;

    return;
  }

  // Display patients

  patientList.forEach(function (patient) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `

            <td>

                <div class="patient-info">

                    <div class="patient-avatar">
                        ${patient.initials}
                    </div>

                    <div>

                        <strong>
                            ${patient.name}
                        </strong>

                        <small>
                            ${patient.id}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${patient.age}
            </td>


            <td>
                ${patient.gender}
            </td>


            <td>
                ${patient.phone}
            </td>


            <td>
                ${patient.doctor}
            </td>


            <td>

                <span class="status ${patient.statusClass}">
                    ${patient.status}
                </span>

            </td>


            <td>

                <!-- VIEW -->
     <button
    type="button"
    class="action-btn view-btn"
    data-id="${patient.id}"
    title="View Patient"
>
    👁️
</button>


                <!-- EDIT -->

                <button
                    type="button"
                    class="action-btn edit-btn"
                    title="Edit"
                    data-id="${patient.id}"
                >
                    ✏️
                </button>


                <!-- DELETE -->

                <button
                    type="button"
                    class="action-btn delete-btn"
                    title="Delete"
                    data-id="${patient.id}"
                >
                    🗑️
                </button>

            </td>

        `;

    patientsTableBody.appendChild(newRow);
  });
}

// ==========================================
// CREATE INITIALS
// ==========================================

function createInitials(name) {
  const nameParts = name.trim().split(/\s+/);

  let initials = nameParts[0].charAt(0);

  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0);
  }

  return initials.toUpperCase();
}

// ==========================================
// GET STATUS CLASS
// ==========================================

function getStatusClass(status) {
  if (status === "Active") {
    return "active-status";
  }

  if (status === "Pending") {
    return "pending-status";
  }

  return "completed-status";
}

// ==========================================
// GENERATE PATIENT ID
// ==========================================

function generatePatientId() {
  let maxNumber = 1000;

  patients.forEach(function (patient) {
    const number = parseInt(patient.id.replace("PT-", ""));

    if (!isNaN(number) && number > maxNumber) {
      maxNumber = number;
    }
  });

  return "PT-" + (maxNumber + 1);
}

// ==========================================
// ADD / EDIT PATIENT
// ==========================================

if (patientForm) {
  patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // ==========================================
    // GET FORM VALUES
    // ==========================================

    const name = document.getElementById("patientName").value.trim();

    const age = document.getElementById("patientAge").value;

    const gender = document.getElementById("patientGender").value;

    const phone = document.getElementById("patientPhone").value.trim();

    const doctor = document.getElementById("patientDoctor").value;

    const status = document.getElementById("patientStatus").value;

    const editPatientId = document.getElementById("editPatientId").value;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      name === "" ||
      age === "" ||
      gender === "" ||
      phone === "" ||
      doctor === "" ||
      status === ""
    ) {
      alert("Please fill all fields!");

      return;
    }

    // ==========================================
    // EDIT PATIENT
    // ==========================================

    if (editPatientId !== "") {
      const patientIndex = patients.findIndex(function (patient) {
        return patient.id === editPatientId;
      });

      if (patientIndex !== -1) {
        patients[patientIndex].name = name;

        patients[patientIndex].age = age;

        patients[patientIndex].gender = gender;

        patients[patientIndex].phone = phone;

        patients[patientIndex].doctor = doctor;

        patients[patientIndex].status = status;

        patients[patientIndex].statusClass = getStatusClass(status);

        patients[patientIndex].initials = createInitials(name);

        // Save

        localStorage.setItem("patients", JSON.stringify(patients));

        // Update table

        displayPatients();

        // Reset form

        patientForm.reset();

        document.getElementById("editPatientId").value = "";

        // Reset modal title

        document.getElementById("addPatientModalLabel").textContent =
          "Add New Patient";

        // Reset button

        document.getElementById("patientSubmitBtn").textContent = "Add Patient";

        // Close modal

        const modalElement = document.getElementById("addPatientModal");

        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
          modal.hide();
        }

        alert("Patient updated successfully!");
      }

      return;
    }

    // ==========================================
    // ADD NEW PATIENT
    // ==========================================

    const newPatient = {
      id: generatePatientId(),

      name: name,

      age: age,

      gender: gender,

      phone: phone,

      doctor: doctor,

      status: status,

      statusClass: getStatusClass(status),

      initials: createInitials(name),
    };

    // Add to array

    patients.push(newPatient);

    // Save LocalStorage

    localStorage.setItem("patients", JSON.stringify(patients));

    // Update table

    displayPatients();

    // Reset form

    patientForm.reset();

    document.getElementById("editPatientId").value = "";

    // Close modal

    const modalElement = document.getElementById("addPatientModal");

    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    alert("Patient added successfully!");
  });
}

// ==========================================
// EDIT BUTTON
// ==========================================

document.addEventListener("click", function (event) {
  const editButton = event.target.closest(".edit-btn");

  if (!editButton) {
    return;
  }

  const patientId = editButton.dataset.id;

  const patient = patients.find(function (item) {
    return item.id === patientId;
  });

  if (!patient) {
    alert("Patient not found!");

    return;
  }

  // Fill hidden ID

  document.getElementById("editPatientId").value = patient.id;

  // Fill form

  document.getElementById("patientName").value = patient.name;

  document.getElementById("patientAge").value = patient.age;

  document.getElementById("patientGender").value = patient.gender;

  document.getElementById("patientPhone").value = patient.phone;

  document.getElementById("patientDoctor").value = patient.doctor;

  document.getElementById("patientStatus").value = patient.status;

  // Change modal title

  document.getElementById("addPatientModalLabel").textContent = "Edit Patient";

  // Change button

  document.getElementById("patientSubmitBtn").textContent = "Update Patient";

  // Open modal

  const modalElement = document.getElementById("addPatientModal");

  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
});

// ==========================================
// DELETE PATIENT
// ==========================================

document.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton) {
    return;
  }

  const patientId = deleteButton.dataset.id;

  deletePatient(patientId);
});

// ==========================================
// DELETE PATIENT FUNCTION
// ==========================================

function deletePatient(patientId) {
  const patient = patients.find(function (item) {
    return item.id === patientId;
  });

  if (!patient) {
    return;
  }

  const confirmDelete = confirm(
    `Are you sure you want to delete ${patient.name}?`,
  );

  if (!confirmDelete) {
    return;
  }

  patients = patients.filter(function (patient) {
    return patient.id !== patientId;
  });

  // Save

  localStorage.setItem("patients", JSON.stringify(patients));

  // Update table

  filterPatients();

  alert("Patient deleted successfully!");
}

// ==========================================
// SEARCH + FILTER
// ==========================================

function filterPatients() {
  if (!patientsTableBody) {
    return;
  }

  const searchValue = patientSearch
    ? patientSearch.value.toLowerCase().trim()
    : "";

  const filterValue = patientFilter ? patientFilter.value.toLowerCase() : "all";

  const filteredPatients = patients.filter(function (patient) {
    // Search

    const matchesSearch =
      patient.name.toLowerCase().includes(searchValue) ||
      patient.id.toLowerCase().includes(searchValue) ||
      patient.phone.toLowerCase().includes(searchValue);

    // Status filter

    const matchesFilter =
      filterValue === "all" || patient.status.toLowerCase() === filterValue;

    return matchesSearch && matchesFilter;
  });

  displayPatients(filteredPatients);
}

// ==========================================
// SEARCH EVENT
// ==========================================

if (patientSearch) {
  patientSearch.addEventListener("input", filterPatients);
}

// ==========================================
// FILTER EVENT
// ==========================================

if (patientFilter) {
  patientFilter.addEventListener("change", filterPatients);
}

// ==========================================
// MODAL RESET
// ==========================================

const addPatientModal = document.getElementById("addPatientModal");

if (addPatientModal) {
  addPatientModal.addEventListener("hidden.bs.modal", function () {
    patientForm.reset();

    document.getElementById("editPatientId").value = "";

    document.getElementById("addPatientModalLabel").textContent =
      "Add New Patient";

    document.getElementById("patientSubmitBtn").textContent = "Add Patient";
  });
}

// ==========================================
// LOAD PATIENTS
// ==========================================

if (patientsTableBody) {
  displayPatients();
}

// ==========================================
// VIEW PATIENT
// ==========================================

document.addEventListener("click", function (event) {
  const viewButton = event.target.closest(".view-btn");

  if (!viewButton) {
    return;
  }

  const patientId = viewButton.dataset.id;

  const patient = patients.find(function (item) {
    return item.id === patientId;
  });

  if (!patient) {
    alert("Patient not found!");

    return;
  }

  // ==========================================
  // FILL VIEW MODAL
  // ==========================================

  document.getElementById("viewPatientAvatar").textContent = patient.initials;

  document.getElementById("viewPatientName").textContent = patient.name;

  document.getElementById("viewPatientId").textContent = patient.id;

  document.getElementById("viewPatientAge").textContent = patient.age;

  document.getElementById("viewPatientGender").textContent = patient.gender;

  document.getElementById("viewPatientPhone").textContent = patient.phone;

  document.getElementById("viewPatientDoctor").textContent = patient.doctor;

  const statusElement = document.getElementById("viewPatientStatus");

  statusElement.textContent = patient.status;

  statusElement.className = "status " + patient.statusClass;

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const modalElement = document.getElementById("viewPatientModal");

  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
});

// ==========================================
// DOCTOR MANAGEMENT
// ==========================================

const doctorForm = document.getElementById("doctorForm");
const doctorsTableBody = document.getElementById("doctorsTableBody");
const doctorSearch = document.getElementById("doctorSearch");
const doctorFilter = document.getElementById("doctorFilter");

// ==========================================
// DEFAULT DOCTORS
// ==========================================

const defaultDoctors = [
  {
    id: "DR-1001",
    name: "Dr. Ahmed Ali",
    specialization: "Cardiologist",
    department: "Cardiology",
    phone: "0300-1111111",
    experience: "10",
    status: "Available",
    statusClass: "active-status",
    initials: "AA",
  },
  {
    id: "DR-1002",
    name: "Dr. Ayesha Ahmed",
    specialization: "Neurologist",
    department: "Neurology",
    phone: "0312-2222222",
    experience: "7",
    status: "Available",
    statusClass: "active-status",
    initials: "AA",
  },
  {
    id: "DR-1003",
    name: "Dr. Bilal Bashir",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    phone: "0321-3333333",
    experience: "12",
    status: "On Leave",
    statusClass: "pending-status",
    initials: "BB",
  },
];

// ==========================================
// LOAD DOCTORS FROM LOCAL STORAGE
// ==========================================

let doctors = JSON.parse(localStorage.getItem("doctors"));

if (!doctors) {
  doctors = defaultDoctors;

  localStorage.setItem("doctors", JSON.stringify(doctors));
}

// ==========================================
// CREATE INITIALS
// ==========================================

function createDoctorInitials(name) {
  const parts = name.trim().split(/\s+/);

  let initials = parts[0].charAt(0);

  if (parts.length > 1) {
    initials += parts[1].charAt(0);
  }

  return initials.toUpperCase();
}

// ==========================================
// STATUS CLASS
// ==========================================

function getDoctorStatusClass(status) {
  if (status === "Available") {
    return "active-status";
  }

  return "pending-status";
}

// ==========================================
// GENERATE DOCTOR ID
// ==========================================

function generateDoctorId() {
  let maxNumber = 1000;

  doctors.forEach(function (doctor) {
    const number = parseInt(doctor.id.replace("DR-", ""));

    if (!isNaN(number) && number > maxNumber) {
      maxNumber = number;
    }
  });

  return "DR-" + (maxNumber + 1);
}

// ==========================================
// DISPLAY DOCTORS
// ==========================================

function displayDoctors(doctorList = doctors) {
  if (!doctorsTableBody) {
    return;
  }

  doctorsTableBody.innerHTML = "";

  if (doctorList.length === 0) {
    doctorsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center; padding:40px;"
                >
                    No doctors found 🔍
                </td>
            </tr>
        `;

    return;
  }

  doctorList.forEach(function (doctor) {
    const row = document.createElement("tr");

    row.innerHTML = `

            <td>

                <div class="patient-info">

                    <div class="patient-avatar">
                        ${doctor.initials}
                    </div>

                    <div>

                        <strong>
                            ${doctor.name}
                        </strong>

                        <small>
                            ${doctor.id}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${doctor.specialization}
            </td>


            <td>
                ${doctor.department}
            </td>


            <td>
                ${doctor.phone}
            </td>


            <td>
                ${doctor.experience} Years
            </td>


            <td>

                <span class="status ${doctor.statusClass}">
                    ${doctor.status}
                </span>

            </td>


            <td>

                <button
                   type="button"
                   class="action-btn view-doctor-btn"
                   data-id="${doctor.id}"
                   title="View"
                >
                   👁️
                </button>


              <button
                   type="button"
                   class="action-btn edit-doctor-btn"
                   data-id="${doctor.id}"
                   title="Edit"
                >
                   ✏️
              </button>


                <button
                    type="button"
                    class="action-btn delete-btn delete-doctor-btn"
                    data-id="${doctor.id}"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>

        `;

    doctorsTableBody.appendChild(row);
  });
}

// ==========================================
// ADD / EDIT DOCTOR
// ==========================================

if (doctorForm) {
  doctorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values

    const name = document.getElementById("doctorName").value.trim();

    const specialization = document
      .getElementById("doctorSpecialization")
      .value.trim();

    const department = document.getElementById("doctorDepartment").value;

    const phone = document.getElementById("doctorPhone").value.trim();

    const experience = document.getElementById("doctorExperience").value;

    const status = document.getElementById("doctorStatus").value;

    const editDoctorId = document.getElementById("editDoctorId").value;

    // Validation

    if (
      name === "" ||
      specialization === "" ||
      department === "" ||
      phone === "" ||
      experience === "" ||
      status === ""
    ) {
      alert("Please fill all fields!");

      return;
    }

    // ==========================================
    // EDIT DOCTOR
    // ==========================================

    if (editDoctorId !== "") {
      const doctorIndex = doctors.findIndex(function (doctor) {
        return doctor.id === editDoctorId;
      });

      if (doctorIndex !== -1) {
        doctors[doctorIndex].name = name;

        doctors[doctorIndex].specialization = specialization;

        doctors[doctorIndex].department = department;

        doctors[doctorIndex].phone = phone;

        doctors[doctorIndex].experience = experience;

        doctors[doctorIndex].status = status;

        doctors[doctorIndex].statusClass = getDoctorStatusClass(status);

        doctors[doctorIndex].initials = createDoctorInitials(name);

        localStorage.setItem("doctors", JSON.stringify(doctors));

        displayDoctors();

        doctorForm.reset();

        document.getElementById("editDoctorId").value = "";

        document.querySelector("#addDoctorModal .modal-title").textContent =
          "Add New Doctor";

        document.getElementById("doctorSubmitBtn").textContent = "Add Doctor";

        const modalElement = document.getElementById("addDoctorModal");

        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
          modal.hide();
        }

        alert("Doctor updated successfully!");
      }

      return;
    }

    // ==========================================
    // ADD NEW DOCTOR
    // ==========================================

    const newDoctor = {
      id: generateDoctorId(),

      name: name,

      specialization: specialization,

      department: department,

      phone: phone,

      experience: experience,

      status: status,

      statusClass: getDoctorStatusClass(status),

      initials: createDoctorInitials(name),
    };

    doctors.push(newDoctor);

    localStorage.setItem("doctors", JSON.stringify(doctors));

    displayDoctors();

    doctorForm.reset();

    const modalElement = document.getElementById("addDoctorModal");

    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    alert("Doctor added successfully!");
  });
}

// ==========================================
// VIEW DOCTOR
// ==========================================

// ==========================================
// VIEW DOCTOR
// ==========================================

document.addEventListener("click", function (event) {
  const viewButton = event.target.closest(".view-doctor-btn");

  if (!viewButton) {
    return;
  }

  const doctorId = viewButton.dataset.id;

  const doctor = doctors.find(function (item) {
    return item.id === doctorId;
  });

  if (!doctor) {
    alert("Doctor not found!");
    return;
  }

  document.getElementById("viewDoctorAvatar").textContent = doctor.initials;

  document.getElementById("viewDoctorName").textContent = doctor.name;

  document.getElementById("viewDoctorId").textContent = doctor.id;

  document.getElementById("viewDoctorSpecialization").textContent =
    doctor.specialization;

  document.getElementById("viewDoctorDepartment").textContent =
    doctor.department;

  document.getElementById("viewDoctorPhone").textContent = doctor.phone;

  document.getElementById("viewDoctorExperience").textContent =
    doctor.experience + " Years";

  const statusElement = document.getElementById("viewDoctorStatus");

  statusElement.textContent = doctor.status;

  statusElement.className = "status " + doctor.statusClass;

  const modalElement = document.getElementById("viewDoctorModal");

  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
});

// ==========================================
// EDIT DOCTOR
// ==========================================

document.addEventListener("click", function (event) {
  const editButton = event.target.closest(".edit-doctor-btn");

  if (!editButton) {
    return;
  }

  const doctorId = editButton.dataset.id;

  const doctor = doctors.find(function (item) {
    return item.id === doctorId;
  });

  if (!doctor) {
    alert("Doctor not found!");

    return;
  }

  // Fill hidden ID

  document.getElementById("editDoctorId").value = doctor.id;

  // Fill form

  document.getElementById("doctorName").value = doctor.name;

  document.getElementById("doctorSpecialization").value = doctor.specialization;

  document.getElementById("doctorDepartment").value = doctor.department;

  document.getElementById("doctorPhone").value = doctor.phone;

  document.getElementById("doctorExperience").value = doctor.experience;

  document.getElementById("doctorStatus").value = doctor.status;

  // Change title

  document.querySelector("#addDoctorModal .modal-title").textContent =
    "Edit Doctor";

  // Change button

  document.getElementById("doctorSubmitBtn").textContent = "Update Doctor";

  // Open modal

  const modalElement = document.getElementById("addDoctorModal");

  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
});

// ==========================================
// DELETE DOCTOR
// ==========================================

document.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-doctor-btn");

  if (!deleteButton) {
    return;
  }

  const doctorId = deleteButton.dataset.id;

  const doctor = doctors.find(function (item) {
    return item.id === doctorId;
  });

  if (!doctor) {
    return;
  }

  const confirmDelete = confirm(
    `Are you sure you want to delete ${doctor.name}?`,
  );

  if (!confirmDelete) {
    return;
  }

  doctors = doctors.filter(function (doctor) {
    return doctor.id !== doctorId;
  });

  localStorage.setItem("doctors", JSON.stringify(doctors));

  filterDoctors();

  alert("Doctor deleted successfully!");
});

// ==========================================
// SEARCH + FILTER DOCTORS
// ==========================================

function filterDoctors() {
  if (!doctorsTableBody) {
    return;
  }

  const searchValue = doctorSearch
    ? doctorSearch.value.toLowerCase().trim()
    : "";

  const filterValue = doctorFilter ? doctorFilter.value : "all";

  const filteredDoctors = doctors.filter(function (doctor) {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchValue) ||
      doctor.id.toLowerCase().includes(searchValue) ||
      doctor.specialization.toLowerCase().includes(searchValue) ||
      doctor.phone.toLowerCase().includes(searchValue);

    const matchesFilter =
      filterValue === "all" || doctor.department === filterValue;

    return matchesSearch && matchesFilter;
  });

  displayDoctors(filteredDoctors);
}

// Search

if (doctorSearch) {
  doctorSearch.addEventListener("input", filterDoctors);
}

// Filter

if (doctorFilter) {
  doctorFilter.addEventListener("change", filterDoctors);
}

// ==========================================
// MODAL RESET
// ==========================================

const addDoctorModal = document.getElementById("addDoctorModal");

if (addDoctorModal) {
  addDoctorModal.addEventListener("hidden.bs.modal", function () {
    doctorForm.reset();

    document.getElementById("editDoctorId").value = "";

    document.querySelector("#addDoctorModal .modal-title").textContent =
      "Add New Doctor";

    document.getElementById("doctorSubmitBtn").textContent = "Add Doctor";
  });
}

// ==========================================
// LOAD DOCTORS
// ==========================================

if (doctorsTableBody) {
  displayDoctors();
}

if (doctorForm) {
  doctorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("doctorName").value.trim();

    const specialization = document
      .getElementById("doctorSpecialization")
      .value.trim();

    const department = document.getElementById("doctorDepartment").value;

    const phone = document.getElementById("doctorPhone").value.trim();

    const experience = document.getElementById("doctorExperience").value;

    const status = document.getElementById("doctorStatus").value;

    // Validation

    if (
      name === "" ||
      specialization === "" ||
      department === "" ||
      phone === "" ||
      experience === "" ||
      status === ""
    ) {
      alert("Please fill all fields!");

      return;
    }

    // Create Doctor

    const newDoctor = {
      id: generateDoctorId(),

      name: name,

      specialization: specialization,

      department: department,

      phone: phone,

      experience: experience,

      status: status,

      statusClass: getDoctorStatusClass(status),

      initials: createDoctorInitials(name),
    };

    // Add to array

    doctors.push(newDoctor);

    // Save to LocalStorage

    localStorage.setItem("doctors", JSON.stringify(doctors));

    // Update table

    displayDoctors();

    // Reset form

    doctorForm.reset();

    // Close modal

    const modalElement = document.getElementById("addDoctorModal");

    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    // Success message

    alert("Doctor added successfully!");
  });
}

// ==========================================
// NURSE MANAGEMENT
// ==========================================

const nurseForm = document.getElementById("nurseForm");
const nursesTableBody = document.getElementById("nursesTableBody");

let nurses = JSON.parse(localStorage.getItem("nurses")) || [];

let editingNurseId = null;


// ==========================================
// DISPLAY NURSES
// ==========================================

function displayNurses(nurseList = nurses) {

    if (!nursesTableBody) {
        return;
    }

    nursesTableBody.innerHTML = "";

    if (nurseList.length === 0) {

        nursesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:40px;">
                    No nurses found 🔍
                </td>
            </tr>
        `;

        return;
    }


    nurseList.forEach(function (nurse) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <!-- NURSE -->

            <td>

                <div class="patient-info">

                    <div class="patient-avatar">
                        ${nurse.initials}
                    </div>

                    <div>

                        <strong>
                            ${nurse.name}
                        </strong>

                        <small>
                            ${nurse.id}
                        </small>

                    </div>

                </div>

            </td>


            <!-- DEPARTMENT -->

            <td>
                ${nurse.department}
            </td>


            <!-- PHONE -->

            <td>
                ${nurse.phone}
            </td>


            <!-- SHIFT -->

            <td>
                ${nurse.shift}
            </td>


            <!-- EXPERIENCE -->

            <td>
                ${nurse.experience} Years
            </td>


            <!-- STATUS -->

            <td>

                <span class="status ${nurse.statusClass}">
                    ${nurse.status}
                </span>

            </td>


            <!-- ACTIONS -->

            <td>

                <!-- VIEW -->

                <button
                    type="button"
                    class="action-btn view-nurse-btn"
                    data-id="${nurse.id}"
                    title="View Nurse"
                >
                    👁️
                </button>


                <!-- EDIT -->

                <button
                    type="button"
                    class="action-btn edit-nurse-btn"
                    data-id="${nurse.id}"
                    title="Edit Nurse"
                >
                    ✏️
                </button>


                <!-- DELETE -->

                <button
                    type="button"
                    class="action-btn delete-nurse-btn"
                    data-id="${nurse.id}"
                    title="Delete Nurse"
                >
                    🗑️
                </button>

            </td>

        `;

        nursesTableBody.appendChild(row);

    });

}


// ==========================================
// CREATE NURSE INITIALS
// ==========================================

function createNurseInitials(name) {

    const parts = name.trim().split(/\s+/);

    let initials = parts[0].charAt(0);

    if (parts.length > 1) {

        initials += parts[1].charAt(0);

    }

    return initials.toUpperCase();

}


// ==========================================
// NURSE STATUS CLASS
// ==========================================

function getNurseStatusClass(status) {

    if (status === "Available") {

        return "active-status";

    }

    return "pending-status";

}


// ==========================================
// GENERATE NURSE ID
// ==========================================

function generateNurseId() {

    let maxNumber = 1000;

    nurses.forEach(function (nurse) {

        if (!nurse.id) {
            return;
        }

        const number =
            parseInt(nurse.id.replace("NR-", ""));

        if (!isNaN(number) && number > maxNumber) {

            maxNumber = number;

        }

    });

    return "NR-" + (maxNumber + 1);

}


// ==========================================
// SAVE NURSES TO LOCAL STORAGE
// ==========================================

function saveNurses() {

    localStorage.setItem(
        "nurses",
        JSON.stringify(nurses)
    );

}


// ==========================================
// ADD / EDIT NURSE
// ==========================================

if (nurseForm) {

    nurseForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // =========================
        // GET FORM VALUES
        // =========================

        const name =
            document.getElementById("nurseName").value.trim();

        const department =
            document.getElementById("nurseDepartment").value;

        const phone =
            document.getElementById("nursePhone").value.trim();

        const shift =
            document.getElementById("nurseShift").value;

        const experience =
            document.getElementById("nurseExperience").value;

        const status =
            document.getElementById("nurseStatus").value;


        // =========================
        // VALIDATION
        // =========================

        if (
            name === "" ||
            department === "" ||
            phone === "" ||
            shift === "" ||
            experience === "" ||
            status === ""
        ) {

            alert("Please fill all fields!");

            return;

        }


        // =========================
        // EDIT EXISTING NURSE
        // =========================

        if (editingNurseId !== null) {

            const nurseIndex =
                nurses.findIndex(function (nurse) {

                    return nurse.id === editingNurseId;

                });


            if (nurseIndex !== -1) {

                nurses[nurseIndex].name = name;

                nurses[nurseIndex].department =
                    department;

                nurses[nurseIndex].phone =
                    phone;

                nurses[nurseIndex].shift =
                    shift;

                nurses[nurseIndex].experience =
                    experience;

                nurses[nurseIndex].status =
                    status;

                nurses[nurseIndex].statusClass =
                    getNurseStatusClass(status);

                nurses[nurseIndex].initials =
                    createNurseInitials(name);


                saveNurses();

                displayNurses();


                nurseForm.reset();

                editingNurseId = null;


                const modalElement =
                    document.getElementById("addNurseModal");

                if (modalElement) {

                    const modal =
                        bootstrap.Modal.getInstance(
                            modalElement
                        );

                    if (modal) {

                        modal.hide();

                    }

                }


                alert("Nurse updated successfully!");

                return;

            }

        }


        // =========================
        // CREATE NEW NURSE
        // =========================

        const newNurse = {

            id: generateNurseId(),

            name: name,

            department: department,

            phone: phone,

            shift: shift,

            experience: experience,

            status: status,

            statusClass:
                getNurseStatusClass(status),

            initials:
                createNurseInitials(name)

        };


        // ADD TO ARRAY

        nurses.push(newNurse);


        // SAVE

        saveNurses();


        // DISPLAY

        displayNurses();


        // RESET FORM

        nurseForm.reset();


        // CLOSE MODAL

        const modalElement =
            document.getElementById("addNurseModal");

        if (modalElement) {

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            if (modal) {

                modal.hide();

            }

        }


        alert("Nurse added successfully!");

    });

}


// ==========================================
// VIEW NURSE
// ==========================================

document.addEventListener("click", function (event) {

    const viewButton =
        event.target.closest(".view-nurse-btn");


    if (!viewButton) {
        return;
    }


    const nurseId =
        viewButton.dataset.id;


    const nurse =
        nurses.find(function (item) {

            return item.id === nurseId;

        });


    if (!nurse) {
        return;
    }


    alert(

        "NURSE DETAILS\n\n" +

        "ID: " +
        nurse.id +

        "\nName: " +
        nurse.name +

        "\nDepartment: " +
        nurse.department +

        "\nPhone: " +
        nurse.phone +

        "\nShift: " +
        nurse.shift +

        "\nExperience: " +
        nurse.experience +
        " Years" +

        "\nStatus: " +
        nurse.status

    );

});


// ==========================================
// EDIT NURSE
// ==========================================

document.addEventListener("click", function (event) {

    const editButton =
        event.target.closest(".edit-nurse-btn");


    if (!editButton) {
        return;
    }


    const nurseId =
        editButton.dataset.id;


    const nurse =
        nurses.find(function (item) {

            return item.id === nurseId;

        });


    if (!nurse) {
        return;
    }


    // =========================
    // SET EDITING ID
    // =========================

    editingNurseId = nurse.id;


    // =========================
    // PUT DATA INTO FORM
    // =========================

    document.getElementById("nurseName").value =
        nurse.name;

    document.getElementById("nurseDepartment").value =
        nurse.department;

    document.getElementById("nursePhone").value =
        nurse.phone;

    document.getElementById("nurseShift").value =
        nurse.shift;

    document.getElementById("nurseExperience").value =
        nurse.experience;

    document.getElementById("nurseStatus").value =
        nurse.status;


    // =========================
    // OPEN MODAL
    // =========================

    const modalElement =
        document.getElementById("addNurseModal");


    if (modalElement) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    }

});


// ==========================================
// DELETE NURSE
// ==========================================

document.addEventListener("click", function (event) {

    const deleteButton =
        event.target.closest(".delete-nurse-btn");


    if (!deleteButton) {
        return;
    }


    const nurseId =
        deleteButton.dataset.id;


    const nurse =
        nurses.find(function (item) {

            return item.id === nurseId;

        });


    if (!nurse) {
        return;
    }


    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${nurse.name}?`
        );


    if (!confirmDelete) {
        return;
    }


    // REMOVE NURSE

    nurses =
        nurses.filter(function (item) {

            return item.id !== nurseId;

        });


    // SAVE

    saveNurses();


    // UPDATE TABLE

    displayNurses();


    alert("Nurse deleted successfully!");

});


// ==========================================
// RESET EDIT MODE WHEN MODAL CLOSES
// ==========================================

const addNurseModal =
    document.getElementById("addNurseModal");


if (addNurseModal) {

    addNurseModal.addEventListener(
        "hidden.bs.modal",
        function () {

            editingNurseId = null;

            if (nurseForm) {

                nurseForm.reset();

            }

        }
    );

}


// ==========================================
// LOAD NURSES WHEN PAGE LOADS
// ==========================================

displayNurses();

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        window.location.href = "login.html";

    });

}


// ==========================================
// ROLE-BASED PAGE PROTECTION
// ==========================================

const currentRole = localStorage.getItem("userRole");

// Get current page name
const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();


// ==========================================
// ALLOWED PAGES
// ==========================================

const rolePermissions = {

    admin: [
        "index.html",
        "patients.html",
        "doctors.html",
        "nurses.html",
        "wards.html",
        "appointments.html",
        "reports.html",
        "settings.html"
    ],

    doctor: [
        "index.html",
        "patients.html",
        "appointments.html"
    ],

    nurse: [
        "index.html",
        "patients.html",
        "wards.html",
        "appointments.html"
    ],

    patient: [
        "index.html",
        "appointments.html"
    ]

};


// ==========================================
// CHECK ACCESS
// ==========================================

if (currentRole && rolePermissions[currentRole]) {

    const allowedPages = rolePermissions[currentRole];

    if (!allowedPages.includes(currentPage)) {

        alert("You do not have permission to access this page.");

        window.location.href =
            currentPage === "index.html"
                ? "index.html"
                : "../index.html";

    }

}


console.log("MAIN JS RUNNING");
console.log("Current Role:", localStorage.getItem("userRole"));
console.log("Current Page:", window.location.pathname);