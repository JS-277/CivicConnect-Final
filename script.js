/* =====================================================
   CIVICCONNECT
   FRONTEND - JAVA BACKEND - MYSQL
   ===================================================== */

const API_URL = "https://civicconnect-prototype-production.up.railway.app/api/complaints";


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const complaintForm =
        document.getElementById("complaintForm");

    if (complaintForm) {
        complaintForm.addEventListener(
            "submit",
            submitComplaint
        );
    }

    setupDescriptionCounter();
    setupEvidencePreview();
    setupAreaTypeFields();
    setupGrievanceTypeFields();

});


/* =====================================================
   SUBMIT COMPLAINT
   ===================================================== */

async function submitComplaint(event) {

    event.preventDefault();

    const name = getElementValue("citizenName");
    const phone = getElementValue("phone");
    const aadhaar = getElementValue("aadhaar");
    const district = getElementValue("district");
    const location = getElementValue("location");
    const description = getElementValue("description");

    const areaType =
        getSelectedRadioValue("areaType");

    const blockName =
        getElementValue("block");

    const panchayat =
        getElementValue("panchayat");

    const municipality =
        getElementValue("municipality");

    const wardNumber =
        getElementValue("wardNumber");

    const grievanceType =
        getSelectedRadioValue("problemType");

    const categoryElement =
        document.getElementById("category");

    const petitionElement =
        document.getElementById("petitionSubject");

    let category = "";

    if (categoryElement) {
        category = categoryElement.value.trim();
    }

    const petitionSubject =
        petitionElement
            ? petitionElement.value.trim()
            : "";


    /* =================================================
       CATEGORY LOGIC
       ================================================= */

    if (grievanceType === "Grievance Petition") {

        category = petitionSubject;

    }


    /* =================================================
       CLEAR ERRORS
       ================================================= */

    clearErrors();

    let isValid = true;


    /* =================================================
       NAME
       ================================================= */

    if (name === "") {

        alert("Please enter your name.");
        isValid = false;

    }


    /* =================================================
       PHONE
       ================================================= */

    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        isValid = false;

    }


    /* =================================================
       AADHAAR
       ================================================= */

    if (!/^[0-9]{12}$/.test(aadhaar)) {

        alert(
            "Please enter a valid 12-digit Aadhaar number."
        );

        isValid = false;

    }


    /* =================================================
       DISTRICT
       ================================================= */

    if (district === "") {

        alert("Please select your district.");
        isValid = false;

    }


    /* =================================================
       AREA TYPE
       ================================================= */

    if (
        areaType !== "Urban" &&
        areaType !== "Rural"
    ) {

        alert(
            "Please select Urban or Rural."
        );

        isValid = false;

    }


    /* =================================================
       RURAL
       ================================================= */

    if (areaType === "Rural") {

        if (blockName === "") {

            alert("Please enter your Block.");
            isValid = false;

        }

        if (panchayat === "") {

            alert("Please enter your Panchayat.");
            isValid = false;

        }

    }


    /* =================================================
       URBAN
       ================================================= */

    if (areaType === "Urban") {

        if (municipality === "") {

            alert(
                "Please enter your Municipality / Corporation."
            );

            isValid = false;

        }

        if (wardNumber === "") {

            alert(
                "Please select your Ward Number."
            );

            isValid = false;

        }

    }


    /* =================================================
       LOCATION
       ================================================= */

    if (location === "") {

        alert(
            "Please enter the area or exact location."
        );

        isValid = false;

    }


    /* =================================================
       GRIEVANCE TYPE
       ================================================= */

    if (
        grievanceType !== "Civic Grievance" &&
        grievanceType !== "Grievance Petition"
    ) {

        alert(
            "Please select Civic Grievance or Grievance Petition."
        );

        isValid = false;

    }


    /* =================================================
       CATEGORY
       ================================================= */

    if (grievanceType === "Civic Grievance") {

        if (category === "") {

            alert(
                "Please select your civic grievance."
            );

            isValid = false;

        }

    }


    /* =================================================
       PETITION
       ================================================= */

    if (grievanceType === "Grievance Petition") {

        if (petitionSubject === "") {

            alert(
                "Please select your grievance petition."
            );

            isValid = false;

        }

    }


    /* =================================================
       DESCRIPTION
       ================================================= */

    if (description.length < 10) {

        alert(
            "Description must contain at least 10 characters."
        );

        isValid = false;

    }


    /* =================================================
       STOP
       ================================================= */

    if (!isValid) {
        return;
    }


    /* =================================================
       SUBMIT BUTTON
       ================================================= */

    const submitButton =
        document.querySelector(
            "#complaintForm button[type='submit']"
        );

    if (submitButton) {

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

    }


    try {

        /* =================================================
           CREATE REQUEST DATA
           ================================================= */

        const formData =
            new URLSearchParams();


        /* =================================================
           BASIC DETAILS
           ================================================= */

        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("district", district);
        formData.append("location", location);
        formData.append("category", category);
        formData.append("description", description);


        /* =================================================
           AREA DETAILS
           ================================================= */

        formData.append("areaType", areaType);
        formData.append("blockName", blockName);
        formData.append("panchayat", panchayat);
        formData.append("municipality", municipality);
        formData.append("wardNumber", wardNumber);


        /* =================================================
           GRIEVANCE DETAILS
           ================================================= */

        formData.append(
            "grievanceType",
            grievanceType
        );

        formData.append(
            "petitionSubject",
            petitionSubject
        );


        console.log(
            "Sending complaint:",
            Object.fromEntries(formData)
        );


        /* =================================================
           SEND TO JAVA
           ================================================= */

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        formData.toString()
                }
            );


        /* =================================================
           READ RESPONSE
           ================================================= */

        const data =
            await response.json();


        console.log(
            "Java response:",
            data
        );


        /* =================================================
           SERVER ERROR
           ================================================= */

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Server returned an error."
            );

        }


        /* =================================================
           SUCCESS CHECK
           ================================================= */

        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to save complaint."
            );

        }


        /* =================================================
           COMPLAINT ID
           ================================================= */

        let complaintId =
            data.complaintId;


        if (
            complaintId === undefined ||
            complaintId === null ||
            complaintId === ""
        ) {

            throw new Error(
                "Complaint saved but ID was not returned."
            );

        }


        let displayId =
            String(complaintId)
                .trim()
                .toUpperCase();


        /* =================================================
           NUMBER → CC001
           ================================================= */

        if (/^\d+$/.test(displayId)) {

            displayId =
                "CC" +
                displayId.padStart(3, "0");

        }


        /* =================================================
           SAVE ID
           ================================================= */

        sessionStorage.setItem(
            "latestComplaintId",
            displayId
        );


        /* =================================================
           DISPLAY ID
           ================================================= */

        const generatedId =
            document.getElementById(
                "generatedId"
            );

        if (generatedId) {

            generatedId.textContent =
                displayId;

        }


        /* =================================================
           HIDE FORM
           ================================================= */

        const complaintForm =
            document.getElementById(
                "complaintForm"
            );

        if (complaintForm) {

            complaintForm.classList.add(
                "hidden"
            );

        }


        /* =================================================
           SHOW SUCCESS
           ================================================= */

        const successMessage =
            document.getElementById(
                "successMessage"
            );

        if (successMessage) {

            successMessage.classList.remove(
                "hidden"
            );

        }


        console.log(
            "Complaint submitted successfully:",
            displayId
        );

    }


    catch (error) {

        console.error(
            "Complaint submission error:",
            error
        );


        alert(
            "Could not submit the complaint.\n\n" +
            error.message
        );

    }


    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit Complaint";

        }

    }

}


/* =====================================================
   GET ELEMENT VALUE
   ===================================================== */

function getElementValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();

}


/* =====================================================
   RADIO VALUE
   ===================================================== */

function getSelectedRadioValue(name) {

    const selected =
        document.querySelector(
            'input[name="' + name + '"]:checked'
        );

    if (!selected) {
        return "";
    }

    return (
        selected.value || ""
    ).trim();

}


/* =====================================================
   CLEAR ERRORS
   ===================================================== */

function clearErrors() {

    const errors = [
        "nameError",
        "phoneError",
        "districtError",
        "locationError",
        "categoryError",
        "descriptionError",
        "petitionSubjectError",
        "trackingError"
    ];

    errors.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = "";
        }

    });

}


/* =====================================================
   RESET FORM
   ===================================================== */

window.resetComplaintForm =
    function resetComplaintForm() {

        const form =
            document.getElementById(
                "complaintForm"
            );

        if (form) {

            form.reset();

            form.classList.remove(
                "hidden"
            );

        }


        const successMessage =
            document.getElementById(
                "successMessage"
            );

        if (successMessage) {

            successMessage.classList.add(
                "hidden"
            );

        }


        const trackingResult =
            document.getElementById(
                "trackingResult"
            );

        if (trackingResult) {

            trackingResult.classList.add(
                "hidden"
            );

        }


        const filePreview =
            document.getElementById(
                "filePreview"
            );

        if (filePreview) {

            filePreview.innerHTML = "";

        }


        clearErrors();

        updateAreaTypeFields();
        updateGrievanceTypeFields();

    };


/* =====================================================
   AREA TYPE
   ===================================================== */

function setupAreaTypeFields() {

    const radios =
        document.querySelectorAll(
            'input[name="areaType"]'
        );

    radios.forEach(function (radio) {

        radio.addEventListener(
            "change",
            updateAreaTypeFields
        );

    });

    updateAreaTypeFields();

}


function updateAreaTypeFields() {

    const selected =
        getSelectedRadioValue(
            "areaType"
        );

    const ruralFields =
        document.getElementById(
            "ruralFields"
        );

    const urbanFields =
        document.getElementById(
            "urbanFields"
        );


    if (ruralFields) {

        if (selected === "Rural") {

            ruralFields.classList.remove(
                "hidden"
            );

        } else {

            ruralFields.classList.add(
                "hidden"
            );

        }

    }


    if (urbanFields) {

        if (selected === "Urban") {

            urbanFields.classList.remove(
                "hidden"
            );

        } else {

            urbanFields.classList.add(
                "hidden"
            );

        }

    }

}


/* =====================================================
   GRIEVANCE TYPE
   ===================================================== */

function setupGrievanceTypeFields() {

    const radios =
        document.querySelectorAll(
            'input[name="problemType"]'
        );

    radios.forEach(function (radio) {

        radio.addEventListener(
            "change",
            updateGrievanceTypeFields
        );

    });

    updateGrievanceTypeFields();

}


function updateGrievanceTypeFields() {

    const selected =
        getSelectedRadioValue(
            "problemType"
        );

    const civicFields =
        document.getElementById(
            "civicGrievanceFields"
        );

    const petitionFields =
        document.getElementById(
            "petitionFields"
        );

    const categoryElement =
        document.getElementById(
            "category"
        );

    const petitionElement =
        document.getElementById(
            "petitionSubject"
        );


    /* =================================================
       CIVIC
       ================================================= */

    if (civicFields) {

        if (selected === "Civic Grievance") {

            civicFields.classList.remove(
                "hidden"
            );

        } else {

            civicFields.classList.add(
                "hidden"
            );

        }

    }


    /* =================================================
       PETITION
       ================================================= */

    if (petitionFields) {

        if (selected === "Grievance Petition") {

            petitionFields.classList.remove(
                "hidden"
            );

        } else {

            petitionFields.classList.add(
                "hidden"
            );

        }

    }


    /* =================================================
       RESET UNUSED FIELD
       ================================================= */

    if (selected === "Civic Grievance") {

        if (petitionElement) {
            petitionElement.value = "";
        }

    }


    if (selected === "Grievance Petition") {

        if (categoryElement) {
            categoryElement.value = "";
        }

    }

}


/* =====================================================
   DESCRIPTION COUNTER
   ===================================================== */

function setupDescriptionCounter() {

    const description =
        document.getElementById(
            "description"
        );

    const counter =
        document.getElementById(
            "descriptionCounter"
        );

    if (!description || !counter) {
        return;
    }

    function updateCounter() {

        counter.textContent =
            description.value.length +
            " / 1000";

    }

    description.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();

}


/* =====================================================
   EVIDENCE PREVIEW
   ===================================================== */

function setupEvidencePreview() {

    const evidenceInput =
        document.getElementById(
            "evidence"
        );

    const evidencePreview =
        document.getElementById(
            "filePreview"
        );

    if (
        !evidenceInput ||
        !evidencePreview
    ) {
        return;
    }


    evidenceInput.addEventListener(
        "change",
        function () {

            evidencePreview.innerHTML = "";


            Array.from(
                evidenceInput.files
            ).forEach(function (file) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "evidence-file";

                item.textContent =
                    "📎 " + file.name;

                evidencePreview.appendChild(
                    item
                );

            });

        }
    );

}


/* =====================================================
   TRACKING TIMELINE
   ===================================================== */

function updateTrackingTimeline(status) {

    const statusSteps =
        document.querySelectorAll(
            ".status-step"
        );

    const statusLines =
        document.querySelectorAll(
            ".status-line-item"
        );


    let currentStep = 1;


    if (status === "Pending") {

        currentStep = 1;

    } else if (status === "In Progress") {

        currentStep = 2;

    } else if (status === "Resolved") {

        currentStep = 3;

    }


    statusSteps.forEach(
        function (step, index) {

            const stepNumber =
                index + 1;

            step.classList.remove(
                "active",
                "completed"
            );


            if (stepNumber < currentStep) {

                step.classList.add(
                    "completed"
                );

            } else if (
                stepNumber === currentStep
            ) {

                step.classList.add(
                    "active"
                );

            }

        }
    );


    statusLines.forEach(
        function (line, index) {

            const lineNumber =
                index + 1;

            line.classList.remove(
                "active",
                "completed"
            );


            if (lineNumber < currentStep) {

                line.classList.add(
                    "completed"
                );

            } else if (
                lineNumber === currentStep - 1
            ) {

                line.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =====================================================
   TRACK COMPLAINT
   ===================================================== */

window.trackComplaint =
    async function trackComplaint() {

        const trackingInput =
            document.getElementById(
                "trackingId"
            );

        const error =
            document.getElementById(
                "trackingError"
            );

        const result =
            document.getElementById(
                "trackingResult"
            );


        if (
            !trackingInput ||
            !error ||
            !result
        ) {

            return;

        }


        const trackingId =
            trackingInput.value
                .trim()
                .toUpperCase();


        error.textContent = "";

        result.classList.add(
            "hidden"
        );


        if (trackingId === "") {

            error.textContent =
                "Please enter a complaint ID.";

            return;

        }


        if (!/^CC[0-9]+$/.test(trackingId)) {

            error.textContent =
                "Enter a valid complaint ID such as CC001.";

            return;

        }


        try {

            const response =
                await fetch(
                    API_URL
                );


            const responseData =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    responseData.message ||
                    "Server error."
                );

            }


            const complaints =
                Array.isArray(responseData)
                    ? responseData
                    : (
                        Array.isArray(
                            responseData.complaints
                        )
                            ? responseData.complaints
                            : []
                    );


            const numericId =
                parseInt(
                    trackingId.substring(2),
                    10
                );


            const complaint =
                complaints.find(
                    function (item) {

                        return Number(
                            item.id
                        ) === numericId;

                    }
                );


            if (!complaint) {

                error.textContent =
                    "Complaint not found. Please check your complaint ID.";

                return;

            }


            const displayTrackingId =
                document.getElementById(
                    "displayTrackingId"
                );


            if (displayTrackingId) {

                displayTrackingId.textContent =
                    trackingId;

            }


            const databaseStatus =
                complaint.status ||
                "Pending";


            let displayStatus =
                databaseStatus;


            if (databaseStatus === "Pending") {

                displayStatus =
                    "Submitted";

            }


            const statusBadge =
                document.getElementById(
                    "statusBadge"
                );


            if (statusBadge) {

                statusBadge.textContent =
                    displayStatus;

            }


            updateTrackingTimeline(
                databaseStatus
            );


            result.classList.remove(
                "hidden"
            );


            const sampleNote =
                document.querySelector(
                    ".sample-note"
                );


            if (sampleNote) {

                sampleNote.textContent =
                    "Your complaint information is retrieved from the CivicConnect system.";

            }


            console.log(
                "Complaint found:",
                complaint
            );


        } catch (errorObject) {

            console.error(
                "Tracking error:",
                errorObject
            );


            error.textContent =
                "Unable to connect to the CivicConnect server.";

            result.classList.add(
                "hidden"
            );

        }

    };


/* =====================================================
   CURRENT LOCATION
   ===================================================== */

window.useCurrentLocation =
    function () {

        if (!navigator.geolocation) {

            alert(
                "Location access is not supported by this browser."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude
                        .toFixed(6);

                const lng =
                    position.coords.longitude
                        .toFixed(6);


                const location =
                    document.getElementById(
                        "location"
                    );


                if (location) {

                    location.value =
                        "Current location (" +
                        lat +
                        ", " +
                        lng +
                        ")";

                }

            },

            function () {

                alert(
                    "Could not access your current location."
                );

            }

        );

    };