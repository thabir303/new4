const express = require('express');
const router = express.Router();
const axios = require('axios');
const STS = require('../models/sts');
const Landfill = require('../models/landfill');

// Function to fetch coordinates of STS based on wardNumber
async function getSTSLocation(wardNumber) {
    const sts = await STS.findOne({ wardNumber });
    return { latitude: sts.latitude, longitude: sts.longitude };
}

// Function to fetch coordinates of landfill based on landfillId
async function getLandfillLocation(landfillId) {
    const landfill = await Landfill.findOne({ landfillId });
    return { latitude: landfill.latitude, longitude: landfill.longitude };
}

// Function to optimize route using GraphHopper API
async function optimizeRoute(startCoords, endCoords) {
    const url = `https://graphhopper.com/api/1/route?point=${startCoords.latitude},${startCoords.longitude}&point=${endCoords.latitude},${endCoords.longitude}&vehicle=car&locale=en&key=0981671d-e144-4a29-9ce0-812ff9084eaa`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}

// Route handler to optimize route between STS and landfill
router.get('/', async (req, res) => {
    const { wardNumber, landfillId } = req.query;
    try {
        // Fetch coordinates of STS and landfill
        const stsCoords = await getSTSLocation(wardNumber);
        const landfillCoords = await getLandfillLocation(landfillId);
        
        // Optimize route using GraphHopper API
        const optimizedRoute = await optimizeRoute(stsCoords, landfillCoords);

        // Access the paths from the response data
        const paths = optimizedRoute.paths;
        const instructionsArray = [];
        if (paths && paths.length > 0) {
            // Iterate over each path to extract the distance, time, and index
            paths.forEach((path, pathIndex) => {
                const instructions = path.instructions;
                if (instructions && instructions.length > 0) {
                    instructions.forEach((instruction, index) => {
                        const distance = instruction.distance;
                        const time = instruction.time;
                        instructionsArray.push({ index: index + 1, distance, time });
                    });
                }
            });
            // Respond with the array of JSON objects containing distance, time, and index
            res.json(instructionsArray);
        } else {
            res.status(404).json({ error: 'No paths found in the response' });
        }
    } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
