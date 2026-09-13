/* =========================================================
   CIVICCONNECT CITIZEN LOGIN / SIGNUP
   PROTOTYPE VERSION
   ========================================================= */


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Make sure the correct form is visible when page loads
    showLogin();

});


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");

    const title =
        document.getElementById("formTitle");

    const subtitle =
        document.getElementById("formSubtitle");


    // Show login form
    if (loginForm) {
        loginForm.classList.remove("hidden");
    }

    // Hide signup form
    if (signupForm) {
        signupForm.classList.remove("active");
    }

    // Update tabs
    if (loginTab) {
        loginTab.classList.add("active");
    }

    if (signupTab) {
        signupTab.classList.remove("active");
    }


    // Update heading
    if (title) {
        title.textContent = "Welcome back";
    }

    if (subtitle) {
        subtitle.textContent =
            "Sign in to your CivicConnect account.";
    }


    hideMessages();
}


/* =========================================================
   SHOW SIGNUP
   ========================================================= */

function showSignup() {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");

    const title =
        document.getElementById("formTitle");

    const subtitle =
        document.getElementById("formSubtitle");


    // Hide login form
    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    // Show signup form
    if (signupForm) {
        signupForm.classList.add("active");
    }

    // Update tabs
    if (loginTab) {
        loginTab.classList.remove("active");
    }

    if (signupTab) {
        signupTab.classList.add("active");
    }


    // Update heading
    if (title) {
        title.textContent =
            "Create your citizen account";
    }

    if (subtitle) {
        subtitle.textContent =
            "Set up your CivicConnect profile once.";
    }


    hideMessages();
}


/* =========================================================
   CREATE ACCOUNT
   ========================================================= */

function handleSignup(event) {

    event.preventDefault();

    hideMessages();


    const nameElement =
        document.getElementById("signupName");

    const phoneElement =
        document.getElementById("signupPhone");

    const passwordElement =
        document.getElementById("signupPassword");


    if (!nameElement ||
        !phoneElement ||
        !passwordElement) {

        showSignupError(
            "Signup form could not be loaded. Please refresh the page."
        );

        return;
    }


    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const password =
        passwordElement.value;


    /* =====================================================
       NAME VALIDATION
       ===================================================== */

    if (name.length < 3) {

        showSignupError(
            "Please enter your full name."
        );

        return;
    }


    /* =====================================================
       PHONE VALIDATION
       ===================================================== */

    if (!/^[0-9]{10}$/.test(phone)) {

        showSignupError(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    /* =====================================================
       PASSWORD VALIDATION
       ===================================================== */

    if (password.length < 6) {

        showSignupError(
            "Password must contain at least 6 characters."
        );

        return;
    }


    /* =====================================================
       CHECK EXISTING ACCOUNT
       ===================================================== */

    const oldAccount =
        localStorage.getItem(
            "civicconnectCitizen"
        );


    if (oldAccount) {

        try {

            const existing =
                JSON.parse(oldAccount);


            if (existing.phone === phone) {

                showSignupError(
                    "An account already exists with this mobile number."
                );

                return;
            }


        } catch (error) {

            // Remove damaged account data
            localStorage.removeItem(
                "civicconnectCitizen"
            );

        }

    }


    /* =====================================================
       CREATE CITIZEN ID
       ===================================================== */

    const citizenId =
        "CIT" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    /* =====================================================
       CREATE CITIZEN ACCOUNT
       ===================================================== */

    const citizen = {

        citizenId: citizenId,

        name: name,

        phone: phone,

        password: password,

        civicPoints: 0,

        createdAt:
            new Date().toISOString()

    };


    /* =====================================================
       SAVE ACCOUNT
       ===================================================== */

    localStorage.setItem(
        "civicconnectCitizen",
        JSON.stringify(citizen)
    );


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    showSignupSuccess(
        "Account created successfully. Your Citizen ID is " +
        citizenId
    );


    /* =====================================================
       RESET SIGNUP FORM
       ===================================================== */

    const signupForm =
        document.getElementById("signupForm");

    if (signupForm) {
        signupForm.reset();
    }


    /* =====================================================
       MOVE TO LOGIN
       ===================================================== */

    setTimeout(function () {

        showLogin();


        const loginPhone =
            document.getElementById("loginPhone");


        if (loginPhone) {

            loginPhone.value =
                phone;

        }


    }, 1500);

}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();

    hideMessages();


    const phoneElement =
        document.getElementById("loginPhone");

    const passwordElement =
        document.getElementById("loginPassword");


    if (!phoneElement ||
        !passwordElement) {

        showLoginError(
            "Login form could not be loaded. Please refresh the page."
        );

        return;
    }


    const phone =
        phoneElement.value.trim();

    const password =
        passwordElement.value;


    /* =====================================================
       PHONE VALIDATION
       ===================================================== */

    if (!/^[0-9]{10}$/.test(phone)) {

        showLoginError(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    /* =====================================================
       PASSWORD VALIDATION
       ===================================================== */

    if (password.length === 0) {

        showLoginError(
            "Please enter your password."
        );

        return;
    }


    /* =====================================================
       GET ACCOUNT
       ===================================================== */

    const account =
        localStorage.getItem(
            "civicconnectCitizen"
        );


    if (!account) {

        showLoginError(
            "No account found. Please create your citizen account first."
        );

        return;
    }


    let citizen;


    try {

        citizen =
            JSON.parse(account);

    } catch (error) {

        showLoginError(
            "Account data could not be read. Please create your account again."
        );

        return;
    }


    /* =====================================================
       CHECK PHONE
       ===================================================== */

    if (citizen.phone !== phone) {

        showLoginError(
            "Mobile number or password is incorrect."
        );

        return;
    }


    /* =====================================================
       CHECK PASSWORD
       ===================================================== */

    if (citizen.password !== password) {

        showLoginError(
            "Mobile number or password is incorrect."
        );

        return;
    }


    /* =====================================================
       LOGIN SUCCESS
       ===================================================== */

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


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    showLoginSuccess(
        "Login successful. Opening your profile..."
    );


    /* =====================================================
       OPEN CITIZEN PROFILE
       ===================================================== */

    setTimeout(function () {

        window.location.href =
            "citizen-profile.html";

    }, 700);

}


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        if (button) {

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        }

    } else {

        input.type = "password";

        if (button) {

            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgotPassword(event) {

    if (event) {
        event.preventDefault();
    }


    showLoginError(
        "Password recovery will be connected to the backend later."
    );

}


/* =========================================================
   LOGIN ERROR
   ========================================================= */

function showLoginError(message) {

    const messageBox =
        document.getElementById(
            "loginMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "message error show";


}


/* =========================================================
   LOGIN SUCCESS
   ========================================================= */

function showLoginSuccess(message) {

    const messageBox =
        document.getElementById(
            "loginMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "message success show";

}


/* =========================================================
   SIGNUP ERROR
   ========================================================= */

function showSignupError(message) {

    const messageBox =
        document.getElementById(
            "signupMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "message error show";

}


/* =========================================================
   SIGNUP SUCCESS
   ========================================================= */

function showSignupSuccess(message) {

    const messageBox =
        document.getElementById(
            "signupMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "message success show";

}


/* =========================================================
   HIDE ALL MESSAGES
   ========================================================= */

function hideMessages() {

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    const signupMessage =
        document.getElementById(
            "signupMessage"
        );


    if (loginMessage) {

        loginMessage.textContent =
            "";

        loginMessage.className =
            "message";

    }


    if (signupMessage) {

        signupMessage.textContent =
            "";

        signupMessage.className =
            "message";

    }

}
