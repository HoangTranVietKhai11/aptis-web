require('dotenv').config();

async function listModelsDirect() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        console.log(`Fetching models from: ${url.replace(key, 'REDACTED')}`);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (response.ok) {
            console.log('--- MODELS ---');
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName})`);
            });
        } else {
            console.log('Error:', JSON.stringify(data));
        }
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
}

listModelsDirect();
