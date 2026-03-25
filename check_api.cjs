const http = require('http');

function checkApi() {
    const options = {
        hostname: 'localhost',
        port: 5128,
        path: '/api/internships',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('API Response (JSON):');
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

checkApi();
