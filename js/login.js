console.log("Login JS Loaded!");

// ==========================================
// DEFAULT ROLE-BASED LOGIN DETAILS
// ==========================================

const defaultUsers = [
    {
        role: "admin",
        email: "admin@medicare.com",
        password: "123456",
        name: "Admin"
    },

    {
        role: "doctor",
        email: "doctor@medicare.com",
        password: "doctor123",
        name: "Doctor"
    },

    {
        role: "nurse",
        email: "nurse@medicare.com",
        password: "nurse123",
        name: "Nurse"
    },

    {
        role: "patient",
        email: "patient@medicare.com",
        password: "patient123",
        name: "Patient"
    }
];


// ==========================================
// SAVE DEFAULT USERS
// ==========================================

if (!localStorage.getItem("users")) {

    localStorage.setItem(
        "users",
        JSON.stringify(defaultUsers)
    );

}




// ==========================================
// LOGIN FORM
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const role =
            document.getElementById("loginRole").value;

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();


        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (!role) {

            alert("Please select your role.");

            return;
        }


        // ==========================================
        // ADMIN LOGIN
        // ==========================================

        const adminEmail =
            localStorage.getItem("loginEmail");

        const adminPassword =
            localStorage.getItem("loginPassword");


        if (role === "admin") {

            if (
                email === adminEmail &&
                password === adminPassword
            ) {

                localStorage.setItem("isLoggedIn", "true");

                localStorage.setItem("userRole", "admin");

                window.location.href = "index.html";

            } else {

                alert("Invalid Admin email or password!");

            }

            return;
        }


        // ==========================================
        // DOCTOR LOGIN
        // ==========================================

        if (role === "doctor") {

            const doctorEmail = "doctor@medicare.com";
            const doctorPassword = "doctor123";

            if (
                email === doctorEmail &&
                password === doctorPassword
            ) {

                localStorage.setItem("isLoggedIn", "true");

                localStorage.setItem("userRole", "doctor");

                window.location.href = "index.html";

            } else {

                alert("Invalid Doctor email or password!");

            }

            return;
        }


        // ==========================================
        // NURSE LOGIN
        // ==========================================

        if (role === "nurse") {

            const nurseEmail = "nurse@medicare.com";
            const nursePassword = "nurse123";

            if (
                email === nurseEmail &&
                password === nursePassword
            ) {

                localStorage.setItem("isLoggedIn", "true");

                localStorage.setItem("userRole", "nurse");

                window.location.href = "index.html";

            } else {

                alert("Invalid Nurse email or password!");

            }

            return;
        }


        // ==========================================
        // PATIENT LOGIN
        // ==========================================

        if (role === "patient") {

            const patientEmail = "patient@medicare.com";
            const patientPassword = "patient123";

            if (
                email === patientEmail &&
                password === patientPassword
            ) {

                localStorage.setItem("isLoggedIn", "true");

                localStorage.setItem("userRole", "patient");

                window.location.href = "index.html";

            } else {

                alert("Invalid Patient email or password!");

            }

        }

    });

}