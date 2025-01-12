document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

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
        });

        if (!isValid) {
            alert("Please fill in all required fields");
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const formData = {
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            fitnessLevel: document.getElementById("fitness-level").value,
            physicalActivity: document.getElementById("physical-activity").value,
            weight: document.getElementById("weight").value,
            height: document.getElementById("height").value,
            goal: document.getElementById("goal").value,
            specificTarget: document.getElementById("specific-target").value,
            medicalCondition: document.getElementById("medical-condition").value,
            diet: document.getElementById("diet").value,
            medications: document.getElementById("medications").value,
            workoutType: document.getElementById("workout-type").value,
            workoutDays: document.getElementById("workout-days").value,
            workoutLength: document.getElementById("workout-length").value,
            dietRecommendations: document.getElementById("diet-recommendations").value,
            meals: document.getElementById("meals").value,
            snacking: document.getElementById("snacking").value,
            progressFrequency: document.getElementById("progress-frequency").value,
            progressMetrics: document.getElementById("progress-metrics").value,
            motivation: document.getElementById("motivation").value,
            challenges: document.getElementById("challenges").value
        };

        try {
            const response = await fetch("http://localhost:5000/submit", {
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

    form.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            if (select.value) {
                select.classList.remove('invalid-field');
                const label = select.previousElementSibling;
                if (label) {
                    label.classList.remove('invalid-label');
                }
            }
        });
    });
});
