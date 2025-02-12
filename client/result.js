document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const fitnessPlanElement = document.getElementById('fitness-plan');

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
        const response = await fetch(`http://localhost:5001/generate-fitness-plan/${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to generate fitness plan');
        }

        const data = await response.json();
        
        clearInterval(loadingInterval);
        loadingElement.style.display = 'none';
        
        fitnessPlanElement.style.display = 'block';
        
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

function formatFitnessPlan(planText) {
    // First, wrap the entire content in a styled div
    let formattedText = '<div class="fitness-plan-content">';
    
    // Format the header section (user info)
    const lines = planText.split('\n');
    let inUserInfo = true;
    let currentSection = '';
    
    lines.forEach(line => {
        // Check if we're starting a new numbered section
        if (/^\d+\./.test(line)) {
            inUserInfo = false;
            currentSection = line.trim();
            formattedText += `
                <div class="plan-section">
                    <h2 class="section-title">${line}</h2>
                    <div class="section-content">`;
        }
        // Format user info section
        else if (inUserInfo) {
            if (line.startsWith('**')) {
                formattedText += `<h1 class="plan-title">${line.replace(/\*\*/g, '')}</h1>`;
            } else if (line.includes(':')) {
                const [key, value] = line.split(':').map(part => part.trim());
                formattedText += `
                    <div class="info-item">
                        <span class="info-label">${key}:</span>
                        <span class="info-value">${value}</span>
                    </div>`;
            } else if (line.trim()) {
                formattedText += `<p class="info-text">${line}</p>`;
            }
        }
        // Format section content
        else {
            if (line.startsWith('-') || line.startsWith('•')) {
                formattedText += `<li class="plan-item">${line.substring(1).trim()}</li>`;
            } else if (line.includes(':') && !line.startsWith(' ')) {
                formattedText += `<h3 class="subsection-title">${line}</h3>`;
            } else if (line.trim()) {
                formattedText += `<p class="plan-text">${line}</p>`;
            }
        }
        
        // Close section div if we're starting a new section
        if (/^\d+\./.test(line) && currentSection) {
            formattedText += `
                    </div>
                </div>`;
        }
    });
    
    // Close the last section and main container
    formattedText += `</div></div>`;
    
    return formattedText;
} 