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
        const response = await fetch(`http://localhost:5000/generate-fitness-plan/${userId}`);
        
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
    return planText
        .split('\n').map(line => {
            if (/^\d+\./.test(line)) {
                return `<h2>${line}</h2>`;
            }
            else if (/^[a-zA-Z]\./.test(line)) {
                return `<h3>${line}</h3>`;
            }
            else {
                return `<p>${line}</p>`;
            }
        }).join('')
        .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
        .replace(/• (.*)/g, '<li>$1</li>')
        .replace(/<li>.*?(<h|$)/g, match => 
            match.replace(/(<h|$)/, '</ul>$1'));
} 