document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Collect form data
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
            // Send data to the server
            const response = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                // Redirect to result page with userId
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
