const http = require('http');

function checkProfiles() {
    const options = {
        hostname: 'localhost',
        port: 5128,
        path: '/api/companies', // I'll guess this endpoint exists based on AdminCompaniesPage.jsx
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('Companies API Response:');
            try {
                const json = JSON.parse(data);
                console.log(JSON.stringify(json, null, 2));
            } catch (e) {
                console.log(data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Error fetching API:', error.message);
    });

    req.end();
}

checkProfiles();
