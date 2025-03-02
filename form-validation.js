document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    const errorMsg = document.getElementById("errorMsg");
    const messageField = form.elements["Message"];
    const nameField = form.elements["Name"];
    const emailField = form.elements["email"];
    const errorLog = [];
    const maxMessageLength = 500;
    
    
    const charCount = document.createElement("p");
    charCount.id = "charCount";
    messageField.parentNode.insertBefore(charCount, messageField.nextSibling);
    
    messageField.addEventListener("input", function () {
        const specialCharRegex = /[^a-zA-Z0-9\s.,!?]/g; 
    
        if (specialCharRegex.test(messageField.value)) {
            messageField.value = messageField.value.replace(specialCharRegex, ""); 
            flashField(messageField, "No Special Characters")
        }   

        const remaining = maxMessageLength - messageField.value.length;
        charCount.textContent = `Characters left: ${remaining}`;
        charCount.style.color = remaining < 50 ? "red" : "white";
        
        if (messageField.value.length === 0) {
            charCount.style.visibility = "hidden"; 
        } else {
            charCount.style.visibility = "visible";
            charCount.textContent = `Characters left: ${remaining}`;
            charCount.style.color = remaining < 50 ? "red" : "white";
        }
    });
    

    nameField.addEventListener("input", function (e) {
        const specialCharRegex = /[^a-zA-Z0-9\s.,!?]/g; 
    
        if (specialCharRegex.test(nameField.value)) {
            nameField.value = nameField.value.replace(specialCharRegex, ""); 
            flashField(nameField, "No Special Characters")
        }   
    });
    
    emailField.addEventListener("input", function (e) {
        if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/.test(emailField.value)) {
            flashField(emailField, "Invalid email format.");
        }
    });
    

    function flashField(field, message) {
        field.style.border = "2px solid red";
        errorMsg.textContent = message;
        errorMsg.style.visibility = "visible";
    
        setTimeout(() => {
            field.style.border = ""; 
            errorMsg.style.visibility = "hidden";
        }, 2000);
    }
    
    

    form.addEventListener("submit", function (event) {
        errorMsg.textContent = "";
        form_errors = []; 

        if (!nameField.checkValidity()) {
            form_errors.push({ field: "Name", issue: "Invalid name format." });
        }
    
        if (!emailField.checkValidity()) {
            form_errors.push({ field: "Email", issue: "Invalid email format." });
        }
    
        if (!messageField.checkValidity()) {
            form_errors.push({ field: "Message", issue: "Invalid message." });
        }

        
        document.getElementById("formErrors").value = JSON.stringify(form_errors);
    });
});
