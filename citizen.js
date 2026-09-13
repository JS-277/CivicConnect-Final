/* =========================================================
   CIVICCONNECT CITIZEN AUTHENTICATION
   ---------------------------------------------------------
   Flow:
   Full Name
        ↓
   Aadhaar Number
        ↓
   Aadhaar-linked Mobile Number
        ↓
   OTP Verification
        ↓
   Automatic Citizen ID
        ↓
   Create Password
        ↓
   CivicConnect Account
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let generatedOTP = null;
let otpVerified = false;
let generatedCitizenId = null;


/* =========================================================
   LOGIN / SIGNUP TAB
   ========================================================= */

function showLogin() {

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");

    if (loginForm) {
        loginForm.classList.remove("hidden");
        loginForm.style.display = "";
    }

    if (signupForm) {
        signupForm.classList.remove("active");
        signupForm.style.display = "none";
    }

    if (loginTab) {
        loginTab.classList.add("active");
    }

    if (signupTab) {
        signupTab.classList.remove("active");
    }

    if (formTitle) {
        formTitle.textContent = "Welcome back";
    }

    if (formSubtitle) {
        formSubtitle.textContent =
            "Sign in to your CivicConnect account.";
    }

    hideMessage(
        document.getElementById("loginMessage")
    );

    hideMessage(
        document.getElementById("signupMessage")
    );
}


function showSignup() {

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");

    if (loginForm) {
        loginForm.classList.add("hidden");
        loginForm.style.display = "none";
    }

    if (signupForm) {
        signupForm.classList.add("active");
        signupForm.style.display = "";
    }

    if (loginTab) {
        loginTab.classList.remove("active");
    }

    if (signupTab) {
        signupTab.classList.add("active");
    }

    if (formTitle) {
        formTitle.textContent = "Create your account";
    }

    if (formSubtitle) {
        formSubtitle.textContent =
            "Verify your identity and create your CivicConnect account.";
    }

    hideMessage(
        document.getElementById("loginMessage")
    );

    hideMessage(
        document.getElementById("signupMessage")
    );
}


/* =========================================================
   MESSAGE FUNCTIONS
   ========================================================= */

function showMessage(elementId, message, type) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        "message show " + type;
}


function hideMessage(element) {

    if (!element) {
        return;
    }

    element.textContent = "";

    element.className =
        "message";
}


/* =========================================================
   GENERATE OTP
   ========================================================= */

function generateOTP() {

    const nameInput =
        document.getElementById("signupName");

    const aadhaarInput =
        document.getElementById("signupAadhaar");

    const mobileInput =
        document.getElementById("signupMobile");


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const aadhaar =
        aadhaarInput
            ? aadhaarInput.value.trim()
            : "";

    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";


    /* -----------------------------------------
       FULL NAME VALIDATION
       ----------------------------------------- */

    if (name.length < 3) {

        showMessage(
            "signupMessage",
            "Please enter your full name.",
            "error"
        );

        if (nameInput) {
            nameInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       AADHAAR VALIDATION
       ----------------------------------------- */

    if (!/^\d{12}$/.test(aadhaar)) {

        showMessage(
            "signupMessage",
            "Please enter a valid 12-digit Aadhaar number.",
            "error"
        );

        if (aadhaarInput) {
            aadhaarInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       MOBILE VALIDATION
       ----------------------------------------- */

    if (!/^[6-9]\d{9}$/.test(mobile)) {

        showMessage(
            "signupMessage",
            "Please enter a valid 10-digit Aadhaar-linked mobile number.",
            "error"
        );

        if (mobileInput) {
            mobileInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       PROTOTYPE OTP
       -----------------------------------------

       In this prototype the OTP is simulated.

       DEMO OTP:
       123456

       A production system would use an
       authorized OTP/SMS service.
       ----------------------------------------- */

    generatedOTP = "123456";

    otpVerified = false;

    generatedCitizenId = null;


    /* -----------------------------------------
       SHOW OTP SECTION
       ----------------------------------------- */

    const otpSection =
        document.getElementById("otpSection");

    if (otpSection) {

        otpSection.classList.add("show");

        otpSection.style.display = "";
    }


    /* -----------------------------------------
       RESET OTP INPUT
       ----------------------------------------- */

    const otpInput =
        document.getElementById("signupOtp");

    if (otpInput) {

        otpInput.value = "";

        otpInput.focus();
    }


    /* -----------------------------------------
       HIDE OLD VERIFICATION
       ----------------------------------------- */

    const verifiedBadge =
        document.getElementById("verifiedBadge");

    if (verifiedBadge) {

        verifiedBadge.classList.remove("show");

        verifiedBadge.style.display = "none";
    }


    const citizenIdBox =
        document.getElementById("citizenIdBox");

    if (citizenIdBox) {

        citizenIdBox.classList.remove("show");

        citizenIdBox.style.display = "none";
    }


    const passwordSection =
        document.getElementById("passwordSection");

    if (passwordSection) {

        passwordSection.style.display = "none";
    }


    /* -----------------------------------------
       DEMO MESSAGE
       ----------------------------------------- */

    showMessage(
        "signupMessage",
        "OTP generated for the Aadhaar-linked mobile number. Prototype demo OTP: 123456",
        "success"
    );
}


/* =========================================================
   VERIFY OTP
   ========================================================= */

function verifyOTP() {

    const otpInput =
        document.getElementById("signupOtp");

    const enteredOTP =
        otpInput
            ? otpInput.value.trim()
            : "";


    /* -----------------------------------------
       CHECK OTP GENERATION
       ----------------------------------------- */

    if (!generatedOTP) {

        showMessage(
            "signupMessage",
            "Please generate the OTP first.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       CHECK OTP FORMAT
       ----------------------------------------- */

    if (!/^\d{6}$/.test(enteredOTP)) {

        showMessage(
            "signupMessage",
            "Please enter the 6-digit OTP.",
            "error"
        );

        if (otpInput) {
            otpInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       VERIFY OTP
       ----------------------------------------- */

    if (enteredOTP !== generatedOTP) {

        showMessage(
            "signupMessage",
            "Incorrect OTP. Please try again.",
            "error"
        );

        if (otpInput) {
            otpInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       IDENTITY VERIFIED
       ----------------------------------------- */

    otpVerified = true;


    /*
       Citizen ID is generated automatically
       only after successful OTP verification.
    */

    generatedCitizenId =
        createCitizenId();


    /* -----------------------------------------
       VERIFICATION BADGE
       ----------------------------------------- */

    const verifiedBadge =
        document.getElementById("verifiedBadge");

    if (verifiedBadge) {

        verifiedBadge.classList.add("show");

        verifiedBadge.style.display = "";
    }


    /* -----------------------------------------
       CITIZEN ID BOX
       ----------------------------------------- */

    const citizenIdBox =
        document.getElementById("citizenIdBox");

    if (citizenIdBox) {

        citizenIdBox.classList.add("show");

        citizenIdBox.style.display = "";
    }


    /* -----------------------------------------
       DISPLAY GENERATED CITIZEN ID
       ----------------------------------------- */

    const generatedCitizenIdElement =
        document.getElementById(
            "generatedCitizenId"
        );

    if (generatedCitizenIdElement) {

        generatedCitizenIdElement.textContent =
            generatedCitizenId;
    }


    /* -----------------------------------------
       SHOW PASSWORD SECTION
       ----------------------------------------- */

    const passwordSection =
        document.getElementById(
            "passwordSection"
        );

    if (passwordSection) {

        passwordSection.style.display = "block";
    }


    /* -----------------------------------------
       HIDE OTP SECTION
       ----------------------------------------- */

    const otpSection =
        document.getElementById("otpSection");

    if (otpSection) {

        otpSection.style.display = "none";
    }


    const otpSendSection =
        document.getElementById(
            "otpSendSection"
        );

    if (otpSendSection) {

        otpSendSection.style.display = "none";
    }


    /* -----------------------------------------
       SUCCESS MESSAGE
       ----------------------------------------- */

    showMessage(
        "signupMessage",
        "Identity verified successfully. Your Citizen ID has been generated automatically.",
        "success"
    );
}


/* =========================================================
   AUTOMATIC CITIZEN ID
   ========================================================= */

function createCitizenId() {

    let citizenId;

    do {

        citizenId =
            "CIT" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );

    } while (
        localStorage.getItem(
            "civicconnectCitizen_" +
            citizenId
        )
    );


    return citizenId;
}


/* =========================================================
   CREATE ACCOUNT
   ========================================================= */

async function handleSignup(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById(
            "signupName"
        );

    const aadhaarInput =
        document.getElementById(
            "signupAadhaar"
        );

    const mobileInput =
        document.getElementById(
            "signupMobile"
        );

    const passwordInput =
        document.getElementById(
            "signupPassword"
        );

    const confirmPasswordInput =
        document.getElementById(
            "signupConfirmPassword"
        );


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const aadhaar =
        aadhaarInput
            ? aadhaarInput.value.trim()
            : "";

    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";

    const password =
        passwordInput
            ? passwordInput.value
            : "";

    const confirmPassword =
        confirmPasswordInput
            ? confirmPasswordInput.value
            : "";


    /* -----------------------------------------
       VALIDATE NAME
       ----------------------------------------- */

    if (name.length < 3) {

        showMessage(
            "signupMessage",
            "Please enter your full name.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       VALIDATE AADHAAR
       ----------------------------------------- */

    if (!/^\d{12}$/.test(aadhaar)) {

        showMessage(
            "signupMessage",
            "Please enter a valid 12-digit Aadhaar number.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       VALIDATE MOBILE
       ----------------------------------------- */

    if (!/^[6-9]\d{9}$/.test(mobile)) {

        showMessage(
            "signupMessage",
            "Please enter a valid 10-digit Aadhaar-linked mobile number.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       OTP VERIFICATION REQUIRED
       ----------------------------------------- */

    if (!otpVerified) {

        showMessage(
            "signupMessage",
            "Please verify your OTP before creating the account.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       CITIZEN ID REQUIRED
       ----------------------------------------- */

    if (!generatedCitizenId) {

        showMessage(
            "signupMessage",
            "Citizen ID could not be generated. Please verify OTP again.",
            "error"
        );

        return;
    }


    /* -----------------------------------------
       PASSWORD VALIDATION
       ----------------------------------------- */

    if (password.length < 6) {

        showMessage(
            "signupMessage",
            "Password must contain at least 6 characters.",
            "error"
        );

        if (passwordInput) {
            passwordInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       CONFIRM PASSWORD
       ----------------------------------------- */

    if (password !== confirmPassword) {

        showMessage(
            "signupMessage",
            "Passwords do not match.",
            "error"
        );

        if (confirmPasswordInput) {
            confirmPasswordInput.focus();
        }

        return;
    }


    try {

        /* -----------------------------------------
           CREATE HASHES
           ----------------------------------------- */

        const aadhaarHash =
            await createHash(aadhaar);

        const passwordHash =
            await createHash(password);


        /* -----------------------------------------
           CHECK DUPLICATE AADHAAR
           ----------------------------------------- */

        const existingAadhaarHash =
            localStorage.getItem(
                "civicconnectAadhaarHash"
            );


        if (
            existingAadhaarHash &&
            existingAadhaarHash === aadhaarHash
        ) {

            showMessage(
                "signupMessage",
                "An account already exists for this verified identity.",
                "error"
            );

            return;
        }


        /* -----------------------------------------
           CITIZEN OBJECT
           ----------------------------------------- */

        const citizen = {

            citizenId:
                generatedCitizenId,

            name:
                name,

            mobile:
                mobile,

            passwordHash:
                passwordHash,

            aadhaarVerified:
                true,

            aadhaarHash:
                aadhaarHash,

            civicPoints:
                0,

            createdAt:
                new Date().toISOString()
        };


        /* -----------------------------------------
           STORE CITIZEN
           ----------------------------------------- */

        localStorage.setItem(
            "civicconnectCitizen",
            JSON.stringify(citizen)
        );


        /* -----------------------------------------
           CITIZEN ID REGISTRY
           ----------------------------------------- */

        localStorage.setItem(
            "civicconnectCitizen_" +
            generatedCitizenId,
            "created"
        );


        /*
           Only the Aadhaar hash is stored.
           Raw Aadhaar is not stored.
        */

        localStorage.setItem(
            "civicconnectAadhaarHash",
            aadhaarHash
        );


        /* -----------------------------------------
           SUCCESS
           ----------------------------------------- */

        showMessage(
            "signupMessage",
            "Account created successfully. Your Citizen ID is " +
            generatedCitizenId +
            ".",
            "success"
        );


        /* -----------------------------------------
           GO TO LOGIN
           ----------------------------------------- */

        setTimeout(
            function () {

                showLogin();


                const loginCitizenId =
                    document.getElementById(
                        "loginCitizenId"
                    );


                if (loginCitizenId) {

                    loginCitizenId.value =
                        generatedCitizenId;

                    loginCitizenId.focus();
                }


                resetSignupState();

            },
            1800
        );


    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        showMessage(
            "signupMessage",
            "Unable to create the account. Please try again.",
            "error"
        );
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    const citizenIdInput =
        document.getElementById(
            "loginCitizenId"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    const citizenId =
        citizenIdInput
            ? citizenIdInput.value
                .trim()
                .toUpperCase()
            : "";

    const password =
        passwordInput
            ? passwordInput.value
            : "";


    /* -----------------------------------------
       CITIZEN ID VALIDATION
       ----------------------------------------- */

    if (!citizenId) {

        showMessage(
            "loginMessage",
            "Please enter your Citizen ID.",
            "error"
        );

        if (citizenIdInput) {
            citizenIdInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       PASSWORD VALIDATION
       ----------------------------------------- */

    if (!password) {

        showMessage(
            "loginMessage",
            "Please enter your password.",
            "error"
        );

        if (passwordInput) {
            passwordInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       GET STORED CITIZEN
       ----------------------------------------- */

    const storedCitizen =
        localStorage.getItem(
            "civicconnectCitizen"
        );


    if (!storedCitizen) {

        showMessage(
            "loginMessage",
            "No CivicConnect account found. Please create an account first.",
            "error"
        );

        return;
    }


    try {

        const citizen =
            JSON.parse(storedCitizen);


        /* -----------------------------------------
           HASH ENTERED PASSWORD
           ----------------------------------------- */

        const enteredPasswordHash =
            await createHash(password);


        /* -----------------------------------------
           CHECK CREDENTIALS
           ----------------------------------------- */

        if (
            citizen.citizenId !== citizenId ||
            citizen.passwordHash !==
            enteredPasswordHash
        ) {

            showMessage(
                "loginMessage",
                "Invalid Citizen ID or password.",
                "error"
            );

            return;
        }


        /* -----------------------------------------
           LOGIN SUCCESS
           ----------------------------------------- */

        sessionStorage.setItem(
            "civicconnectLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "civicconnectCitizenId",
            citizen.citizenId
        );

        sessionStorage.setItem(
            "civicconnectCitizenName",
            citizen.name
        );


        showMessage(
            "loginMessage",
            "Login successful. Opening your Citizen Profile...",
            "success"
        );


        setTimeout(
            function () {

                window.location.href =
                    "citizen-profile.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showMessage(
            "loginMessage",
            "Account data is invalid. Please create the account again.",
            "error"
        );
    }
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgotPassword() {

    alert(
        "Password recovery will be connected to the backend later."
    );
}


/* =========================================================
   SHA-256 HASH
   ========================================================= */

async function createHash(value) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(value);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );


    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* =========================================================
   RESET SIGNUP STATE
   ========================================================= */

function resetSignupState() {

    generatedOTP = null;

    otpVerified = false;

    generatedCitizenId = null;


    const signupForm =
        document.getElementById(
            "signupForm"
        );

    if (signupForm) {
        signupForm.reset();
    }


    const otpSection =
        document.getElementById(
            "otpSection"
        );

    if (otpSection) {

        otpSection.classList.remove("show");

        otpSection.style.display = "none";
    }


    const otpSendSection =
        document.getElementById(
            "otpSendSection"
        );

    if (otpSendSection) {

        otpSendSection.style.display = "";
    }


    const verifiedBadge =
        document.getElementById(
            "verifiedBadge"
        );

    if (verifiedBadge) {

        verifiedBadge.classList.remove("show");

        verifiedBadge.style.display = "none";
    }


    const citizenIdBox =
        document.getElementById(
            "citizenIdBox"
        );

    if (citizenIdBox) {

        citizenIdBox.classList.remove("show");

        citizenIdBox.style.display = "none";
    }


    const generatedCitizenIdElement =
        document.getElementById(
            "generatedCitizenId"
        );

    if (generatedCitizenIdElement) {

        generatedCitizenIdElement.textContent =
            "—";
    }


    const passwordSection =
        document.getElementById(
            "passwordSection"
        );

    if (passwordSection) {

        passwordSection.style.display =
            "none";
    }
}


/* =========================================================
   PASSWORD SHOW / HIDE EYE ICON
   ========================================================= */

function addPasswordToggle(inputId) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    /*
       Prevent adding the eye button twice.
    */

    if (
        input.dataset.eyeAdded === "true"
    ) {
        return;
    }


    input.dataset.eyeAdded = "true";


    /* -----------------------------------------
       CREATE WRAPPER
       ----------------------------------------- */

    const wrapper =
        document.createElement("div");

    wrapper.style.position =
        "relative";

    wrapper.style.width =
        "100%";


    /* Put wrapper around input */

    input.parentNode.insertBefore(
        wrapper,
        input
    );

    wrapper.appendChild(input);


    /* -----------------------------------------
       INPUT SPACE FOR EYE
       ----------------------------------------- */

    input.style.paddingRight =
        "50px";


    /* -----------------------------------------
       CREATE BUTTON
       ----------------------------------------- */

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.innerHTML =
        "👁";


    button.setAttribute(
        "aria-label",
        "Show password"
    );


    /* -----------------------------------------
       BUTTON STYLE
       ----------------------------------------- */

    button.style.position =
        "absolute";

    button.style.right =
        "12px";

    button.style.top =
        "50%";

    button.style.transform =
        "translateY(-50%)";

    button.style.border =
        "none";

    button.style.background =
        "transparent";

    button.style.cursor =
        "pointer";

    button.style.fontSize =
        "18px";

    button.style.padding =
        "6px";

    button.style.lineHeight =
        "1";

    button.style.zIndex =
        "10";


    /* -----------------------------------------
       CLICK EVENT
       ----------------------------------------- */

    button.addEventListener(
        "click",
        function () {

            if (
                input.type ===
                "password"
            ) {

                input.type =
                    "text";

                button.innerHTML =
                    "🙈";

                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                input.type =
                    "password";

                button.innerHTML =
                    "👁";

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        }
    );


    wrapper.appendChild(
        button
    );
}


/* =========================================================
   INPUT RESTRICTIONS + INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* -----------------------------------------
           AADHAAR INPUT
           ----------------------------------------- */

        const aadhaarInput =
            document.getElementById(
                "signupAadhaar"
            );

        if (aadhaarInput) {

            aadhaarInput.addEventListener(
                "input",
                function () {

                    this.value =
                        this.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                }
            );
        }


        /* -----------------------------------------
           MOBILE INPUT
           ----------------------------------------- */

        const mobileInput =
            document.getElementById(
                "signupMobile"
            );

        if (mobileInput) {

            mobileInput.addEventListener(
                "input",
                function () {

                    this.value =
                        this.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                }
            );
        }


        /* -----------------------------------------
           OTP INPUT
           ----------------------------------------- */

        const otpInput =
            document.getElementById(
                "signupOtp"
            );

        if (otpInput) {

            otpInput.addEventListener(
                "input",
                function () {

                    this.value =
                        this.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                }
            );
        }


        /* -----------------------------------------
           PASSWORD EYE ICONS
           ----------------------------------------- */

        addPasswordToggle(
            "loginPassword"
        );

        addPasswordToggle(
            "signupPassword"
        );

        addPasswordToggle(
            "signupConfirmPassword"
        );


        /* -----------------------------------------
           START WITH LOGIN
           ----------------------------------------- */

        showLogin();
    }
);