document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    // Function to handle select changes and show/hide input fields
    function handleSpecifyOption(select) {
        const currentValue = select.value;
        let inputField = select.nextElementSibling;
        
        // Remove existing input field if it exists
        if (inputField && inputField.classList.contains('specify-input')) {
            inputField.remove();
        }

        // Check if the selected option requires specification
        if (currentValue === 'other' || currentValue === 'yes') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'specify-input';
            input.placeholder = 'Please specify...';
            input.required = true;
            select.parentNode.insertBefore(input, select.nextSibling);
        }
    }

    // Add event listeners to all select elements
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            handleSpecifyOption(select);
            if (select.value) {
                select.classList.remove('invalid-field');
                const label = select.previousElementSibling;
                if (label) {
                    label.classList.remove('invalid-label');
                }
            }
        });
    });

    // Modified form submission handler
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const selectElements = form.querySelectorAll('select');
        let isValid = true;
        let firstInvalidField = null;

        selectElements.forEach(select => {
            select.classList.remove('invalid-field');
            const label = select.previousElementSibling;
            if (label) {
                label.classList.remove('invalid-label');
            }

            if (!select.value) {
                isValid = false;
                select.classList.add('invalid-field');
                if (label) {
                    label.classList.add('invalid-label');
                }
                if (!firstInvalidField) {
                    firstInvalidField = select;
                }
            }

            // Validate specification input if required
            const specifyInput = select.nextElementSibling;
            if ((select.value === 'other' || select.value === 'yes') && 
                specifyInput && specifyInput.classList.contains('specify-input')) {
                if (!specifyInput.value.trim()) {
                    isValid = false;
                    specifyInput.classList.add('invalid-field');
                    if (!firstInvalidField) {
                        firstInvalidField = specifyInput;
                    }
                }
            }
        });

        if (!isValid) {
            alert("Please fill in all required fields");
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Collect form data including specifications
        const formData = {};
        selectElements.forEach(select => {
            let value = select.value;
            const specifyInput = select.nextElementSibling;
            if ((value === 'other' || value === 'yes') && 
                specifyInput && specifyInput.classList.contains('specify-input')) {
                value += `: ${specifyInput.value.trim()}`;
            }
            formData[select.id.replace(/-/g, '')] = value;
        });

        try {
            const response = await fetch("http://localhost:5001/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                window.location.href = `result.html?userId=${data.userId}`;
            } else {
                alert("Failed to submit the form. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
