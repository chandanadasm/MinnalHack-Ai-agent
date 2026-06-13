// Global fetch is used
async function run() {
    const url = 'http://localhost:5000/api/chat';
    const payload = {
        messages: [
            { role: 'user', content: 'What is 47 × 93?' }
        ],
        onboardingState: {
            hackathonName: '',
            theme: '',
            duration: '',
            teamSize: '1',
            teamSkills: [],
            goals: []
        },
        projectMemory: {}
    };
    try {
        console.log('Sending request to', url);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response body:', JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error('Error calling /api/chat:', error);
    }
}
run();
export {};
