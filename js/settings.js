console.log("Settings Management Loaded!");


// ==========================================
// SETTINGS ELEMENTS
// ==========================================

const profileForm = document.getElementById("profileForm");

const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const hospitalName = document.getElementById("hospitalName");

const themeSelect = document.getElementById("themeSelect");
const saveThemeBtn = document.getElementById("saveThemeBtn");

const appointmentNotifications =
    document.getElementById("appointmentNotifications");

const patientNotifications =
    document.getElementById("patientNotifications");

const systemNotifications =
    document.getElementById("systemNotifications");

const saveNotificationsBtn =
    document.getElementById("saveNotificationsBtn");

const resetSettingsBtn =
    document.getElementById("resetSettingsBtn");


// ==========================================
// LOAD PROFILE
// ==========================================

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem("hospitalProfile")
        ) || {

            adminName: "Hospital Admin",

            adminEmail: "admin@medicare.com",

            hospitalName: "MediCare Hospital"

        };


    adminName.value =
        profile.adminName;

    adminEmail.value =
        profile.adminEmail;

    hospitalName.value =
        profile.hospitalName;

}


// ==========================================
// SAVE PROFILE
// ==========================================

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const profile = {

                adminName:
                    adminName.value.trim(),

                adminEmail:
                    adminEmail.value.trim(),

                hospitalName:
                    hospitalName.value.trim()

            };


            if (
                profile.adminName === "" ||
                profile.adminEmail === "" ||
                profile.hospitalName === ""
            ) {

                alert(
                    "Please fill all profile fields!"
                );

                return;

            }


            localStorage.setItem(
                "hospitalProfile",
                JSON.stringify(profile)
            );


            alert(
                "Profile saved successfully! ✅"
            );

        }
    );

}


// ==========================================
// LOAD THEME
// ==========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("hospitalTheme")
        || "default";


    themeSelect.value =
        savedTheme;


    applyTheme(savedTheme);

}


// ==========================================
// APPLY THEME
// ==========================================

function applyTheme(theme) {

    document.body.classList.remove(
        "dark-theme",
        "light-theme"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }


    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    }

}


// ==========================================
// SAVE THEME
// ==========================================

if (saveThemeBtn) {

    saveThemeBtn.addEventListener(
        "click",
        function () {

            const selectedTheme =
                themeSelect.value;


            localStorage.setItem(
                "hospitalTheme",
                selectedTheme
            );


            applyTheme(
                selectedTheme
            );


            alert(
                "Appearance saved successfully! 🎨"
            );

        }
    );

}


// ==========================================
// LOAD NOTIFICATIONS
// ==========================================

function loadNotifications() {

    const notifications =
        JSON.parse(
            localStorage.getItem(
                "hospitalNotifications"
            )
        ) || {

            appointments: true,

            patients: true,

            system: true

        };


    appointmentNotifications.checked =
        notifications.appointments;

    patientNotifications.checked =
        notifications.patients;

    systemNotifications.checked =
        notifications.system;

}


// ==========================================
// SAVE NOTIFICATIONS
// ==========================================

if (saveNotificationsBtn) {

    saveNotificationsBtn.addEventListener(
        "click",
        function () {

            const notifications = {

                appointments:
                    appointmentNotifications.checked,

                patients:
                    patientNotifications.checked,

                system:
                    systemNotifications.checked

            };


            localStorage.setItem(
                "hospitalNotifications",
                JSON.stringify(
                    notifications
                )
            );


            alert(
                "Notification settings saved! 🔔"
            );

        }
    );

}


// ==========================================
// RESET SETTINGS
// ==========================================

if (resetSettingsBtn) {

    resetSettingsBtn.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Are you sure you want to reset all settings?"
                );


            if (!confirmReset) {
                return;
            }


            localStorage.removeItem(
                "hospitalProfile"
            );

            localStorage.removeItem(
                "hospitalTheme"
            );

            localStorage.removeItem(
                "hospitalNotifications"
            );


            loadProfile();

            loadTheme();

            loadNotifications();


            alert(
                "Settings reset successfully! 🔄"
            );

        }
    );

}


// ==========================================
// INITIALIZE SETTINGS
// ==========================================

loadProfile();

loadTheme();

loadNotifications();