const axios = require('axios');

/**
 * Fetches data from the given URL and logs the distance and time.
 * @param {string} url - The URL to fetch data from, including any query parameters.
 */
function fetchDataAndLogDistanceTime(url) {
    axios.get(url)
        .then(response => {
            const paths = response.data.paths;
            if (paths && paths.length > 0) {
                const distance = paths[0].distance;
                const time = paths[0].time;
                
                console.log(`Distance: ${distance}, Time: ${time}`);
            } else {
                console.log('No paths found in the response.');
            }
        })
        .catch(error => {
            console.error('Error fetching distance and time:', error.message);
        });
}

module.exports = fetchDataAndLogDistanceTime;
