document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    const errorMsg = document.getElementById("errorMsg");
    const messageField = form.elements["Message"];
    const nameField = form.elements["Name"];
    const emailField = form.elements["email"];
    const maxMessageLength = 500;

    let loggedErrors = new Set();
    
    const charCount = document.createElement("p");
    charCount.id = "charCount";
    messageField.parentNode.insertBefore(charCount, messageField.nextSibling);
    
    const specialCharRegex = /[^a-zA-Z0-9\s.,!?]/g; 
    
    function flashField(field, message) {
        field.style.border = "2px solid red";
        errorMsg.textContent = message;
        errorMsg.style.visibility = "visible";
    
        setTimeout(() => {
            field.style.border = ""; 
            errorMsg.style.visibility = "hidden";
        }, 2000);
    }

    function logError(fieldName, issue) {
        const errorMessage = `${fieldName}: ${issue}`;
        
        if (!loggedErrors.has(errorMessage)) {
            loggedErrors.add(errorMessage);
        }
    }

    messageField.addEventListener("input", function () {
        if (specialCharRegex.test(messageField.value)) {
            messageField.value = messageField.value.replace(specialCharRegex, ""); 
            flashField(messageField, "No Special Characters");
            logError("Message Field", "User Attempted Special Character");
        }   

        const remaining = maxMessageLength - messageField.value.length;
        charCount.textContent = `Characters left: ${remaining}`;
        charCount.style.color = remaining < 50 ? "var(--error-color)" : "var(--secondary-color)";
        charCount.style.visibility = messageField.value.length === 0 ? "hidden" : "visible";
    });

    messageField.addEventListener("blur", function (){
        if (messageField.value.length < 10){
            flashField(messageField, "Message must be atleast 10 characters!"); 
            logError("Message Field", "User's message was too short");
          } 
    })

    nameField.addEventListener("input", function () {
        if (specialCharRegex.test(nameField.value)) {
            nameField.value = nameField.value.replace(specialCharRegex, ""); 
            flashField(nameField, "No Special Characters");
            logError("Name Field", "User Attempted Special Character");
        }   
    });

    nameField.addEventListener("blur", function () {
        if(nameField.value.length == 0){
            flashField(nameField, "Please provide a name"); 
            logError("Message Field", "User failed to provide a name");
        }
    });

    emailField.addEventListener("blur", function () {
        if (!emailField.checkValidity()) {
            logError("Email Field", "Invalid email format.");
            flashField(emailField, "Invalid email format.");
        }
    });
    
    form.addEventListener("submit", function (event) {
        if (messageField.value.length < 10) {
            flashField(messageField, "Message must be at least 10 characters!");
            logError("Message Field", "User's message was too short");
            event.preventDefault(); 
        } else {
            document.getElementById("formErrors").value = JSON.stringify(Array.from(loggedErrors));
            form.submit();
        }
    });
});
