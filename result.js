document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const fitnessPlanElement = document.getElementById('fitness-plan');

    // Loading text animation
    const loadingTexts = [
        "Analyzing your fitness goals...",
        "Customizing your workout plan...",
        "Creating your nutrition guide...",
        "Finalizing your personalized plan..."
    ];
    let currentTextIndex = 0;
    const loadingTextElement = loadingElement.querySelector('.loading-text');
    
    const updateLoadingText = () => {
        loadingTextElement.textContent = loadingTexts[currentTextIndex];
        currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
    };
    
    const loadingInterval = setInterval(updateLoadingText, 2000);

    if (!userId) {
        clearInterval(loadingInterval);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = 'No user ID provided. Please go back and submit the form again.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/generate-fitness-plan/${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to generate fitness plan');
        }

        const data = await response.json();
        
        // Clear the loading interval and hide loading element
        clearInterval(loadingInterval);
        loadingElement.style.display = 'none';
        
        // Show the fitness plan with formatted content
        fitnessPlanElement.style.display = 'block';
        
        // Format and display the fitness plan
        const formattedPlan = formatFitnessPlan(data.fitnessPlan);
        fitnessPlanElement.innerHTML = formattedPlan;

    } catch (error) {
        clearInterval(loadingInterval);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.innerHTML = `
            <h3>Error generating fitness plan</h3>
            <p>Please try again later or contact support if the problem persists.</p>
            <button onclick="window.location.reload()" class="retry-btn">Try Again</button>
        `;
        console.error('Error:', error);
    }
});

// Helper function to format the fitness plan text with HTML
function formatFitnessPlan(planText) {
    return planText
        // Convert line breaks to HTML
        .split('\n').map(line => {
            // Check if line is a header (contains numbers followed by dot)
            if (/^\d+\./.test(line)) {
                return `<h2>${line}</h2>`;
            }
            // Check if line is a subheader (contains letters followed by dot)
            else if (/^[a-zA-Z]\./.test(line)) {
                return `<h3>${line}</h3>`;
            }
            // Regular text
            else {
                return `<p>${line}</p>`;
            }
        }).join('')
        // Make important text bold
        .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
        // Create lists
        .replace(/• (.*)/g, '<li>$1</li>')
        // Wrap lists in ul tags
        .replace(/<li>.*?(<h|$)/g, match => 
            match.replace(/(<h|$)/, '</ul>$1'));
} 