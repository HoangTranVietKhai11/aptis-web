require('dotenv').config();

async function testDirectFetch() {
    const key = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash";
    
    const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`
    ];

    for (const url of endpoints) {
        try {
            console.log(`\nTesting URL: ${url.replace(key, 'REDACTED')}`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Say hello" }] }]
                })
            });

            const data = await response.json();
            console.log(`Status: ${response.status} ${response.statusText}`);
            if (response.ok) {
                console.log(`✅ SUCCESS! Response: ${JSON.stringify(data.candidates[0].content.parts[0].text)}`);
            } else {
                console.log(`❌ FAILED: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error(`❌ ERROR: ${error.message}`);
        }
    }
}

testDirectFetch();
