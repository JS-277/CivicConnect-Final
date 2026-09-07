/* =========================================================
   CIVICCONNECT CITIZEN LOGIN / SIGNUP
   PROTOTYPE VERSION
   ========================================================= */


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");


    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }


    if (signupForm) {
        signupForm.addEventListener(
            "submit",
            handleSignup
        );
    }

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
        document.getElementById("authTitle");

    const subtitle =
        document.getElementById("authSubtitle");


    loginForm.classList.remove("hidden");

    signupForm.classList.add("hidden");

    loginTab.classList.add("active");

    signupTab.classList.remove("active");

    title.textContent =
        "Welcome back";

    subtitle.textContent =
        "Sign in to your CivicConnect account.";

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
        document.getElementById("authTitle");

    const subtitle =
        document.getElementById("authSubtitle");


    loginForm.classList.add("hidden");

    signupForm.classList.remove("hidden");

    loginTab.classList.remove("active");

    signupTab.classList.add("active");

    title.textContent =
        "Create your citizen account";

    subtitle.textContent =
        "Set up your CivicConnect profile once.";

    hideMessages();
}


/* =========================================================
   CREATE ACCOUNT
   ========================================================= */

function handleSignup(event) {

    event.preventDefault();

    hideMessages();


    const name =
        document.getElementById("signupName")
            .value.trim();

    const phone =
        document.getElementById("signupPhone")
            .value.trim();

    const password =
        document.getElementById("signupPassword")
            .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
            .value;


    /* NAME */

    if (name.length < 3) {

        showError(
            "Please enter your full name."
        );

        return;
    }


    /* PHONE */

    if (!/^[0-9]{10}$/.test(phone)) {

        showError(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    /* PASSWORD */

    if (password.length < 6) {

        showError(
            "Password must contain at least 6 characters."
        );

        return;
    }


    /* CONFIRM PASSWORD */

    if (password !== confirmPassword) {

        showError(
            "Passwords do not match."
        );

        return;
    }


    /* CHECK EXISTING ACCOUNT */

    const oldAccount =
        localStorage.getItem(
            "civicconnectCitizen"
        );


    if (oldAccount) {

        try {

            const existing =
                JSON.parse(oldAccount);


            if (existing.phone === phone) {

                showError(
                    "An account already exists with this mobile number."
                );

                return;
            }

        } catch (error) {

            localStorage.removeItem(
                "civicconnectCitizen"
            );

        }

    }


    /* CREATE CITIZEN ID */

    const citizenId =
        "CIT" +
        Math.floor(
            100000 + Math.random() * 900000
        );


    /* CREATE ACCOUNT */

    const citizen = {

        citizenId: citizenId,

        name: name,

        phone: phone,

        password: password,

        civicPoints: 0,

        createdAt:
            new Date().toISOString()

    };


    /* SAVE ACCOUNT */

    localStorage.setItem(
        "civicconnectCitizen",
        JSON.stringify(citizen)
    );


    /* SUCCESS */

    showSuccess(
        "Account created successfully. Citizen ID: " +
        citizenId
    );


    document.getElementById(
        "signupForm"
    ).reset();


    /* MOVE TO LOGIN */

    setTimeout(function () {

        showLogin();

        document.getElementById(
            "loginPhone"
        ).value = phone;

    }, 1500);

}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();

    hideMessages();


    const phone =
        document.getElementById("loginPhone")
            .value.trim();

    const password =
        document.getElementById("loginPassword")
            .value;


    if (!/^[0-9]{10}$/.test(phone)) {

        showError(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (password.length === 0) {

        showError(
            "Please enter your password."
        );

        return;
    }


    /* GET ACCOUNT */

    const account =
        localStorage.getItem(
            "civicconnectCitizen"
        );


    if (!account) {

        showError(
            "No account found. Please create your citizen account first."
        );

        return;
    }


    let citizen;


    try {

        citizen =
            JSON.parse(account);

    } catch (error) {

        showError(
            "Account data could not be read."
        );

        return;
    }


    /* CHECK PHONE */

    if (citizen.phone !== phone) {

        showError(
            "Mobile number or password is incorrect."
        );

        return;
    }


    /* CHECK PASSWORD */

    if (citizen.password !== password) {

        showError(
            "Mobile number or password is incorrect."
        );

        return;
    }


    /* LOGIN SUCCESS */

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


    showSuccess(
        "Login successful. Opening your profile..."
    );


    setTimeout(function () {

        window.location.href =
            "citizen-profile.html";

    }, 700);

}


/* =========================================================
   SHOW / HIDE PASSWORD
   ========================================================= */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "Hide";

    } else {

        input.type = "password";

        button.textContent = "Show";

    }

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgotPassword(event) {

    event.preventDefault();

    showError(
        "Password recovery will be connected to the backend later."
    );

}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showError(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );

    const success =
        document.getElementById(
            "successMessage"
        );


    if (success) {
        success.style.display = "none";
    }


    if (error) {

        error.textContent =
            message;

        error.style.display =
            "block";

    }

}


/* =========================================================
   SUCCESS MESSAGE
   ========================================================= */

function showSuccess(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );

    const success =
        document.getElementById(
            "successMessage"
        );


    if (error) {
        error.style.display = "none";
    }


    if (success) {

        success.textContent =
            message;

        success.style.display =
            "block";

    }

}


/* =========================================================
   HIDE MESSAGES
   ========================================================= */

function hideMessages() {

    const error =
        document.getElementById(
            "errorMessage"
        );

    const success =
        document.getElementById(
            "successMessage"
        );


    if (error) {

        error.textContent = "";

        error.style.display =
            "none";

    }


    if (success) {

        success.textContent = "";

        success.style.display =
            "none";

    }

}