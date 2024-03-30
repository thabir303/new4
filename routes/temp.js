const axios = require('axios');

// Define the URL you want to send the GET request to
const url = 'http://localhost:8080/api/distance?wardNumber=123&landfillId=456';

// Perform the GET request using Axios
axios.get(url)
  .then(response => {
    // Access the instructions from the first path in the response data
    const instructions = response.data.paths[0].instructions;
    if (instructions && instructions.length > 0) {
      // Iterate over each instruction to extract and log the distance and time
      instructions.forEach((instruction, index) => {
        const distance = instruction.distance;
        const time = instruction.time;
        
        // Log the distance and time for each instruction
        console.log(`Instruction ${index + 1}: Distance = ${distance}, Time = ${time}`);
      });
    } else {
      console.log('No instructions found in the response.');
    }
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error('Error fetching data:', error.message);
  });
