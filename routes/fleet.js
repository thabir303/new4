const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vehicle = require('../models/vehicle');
const STS = require('../models/sts');
const Landfill = require('../models/landfill');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
    const { wardNumber, registrationNumber, landfillId } = req.query;

    try {
        const vehicle = await Vehicle.findOne({
            registrationNumber: registrationNumber,
            wardNumber: wardNumber
        });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const sts = await STS.findOne({ wardNumber: wardNumber });
        if (!sts) return res.status(404).json({ message: "STS not found" });

        const landfill = await Landfill.findOne({ landfillId: landfillId });
        if (!landfill) return res.status(404).json({ message: "Landfill not found" });

        const payload = {
            vehicles: [{
                vehicle_id: vehicle._id.toString(),
                type_id: 'bus',
                start_address: {
                    location_id: sts.locationId,
                    lon: sts.longitude,
                    lat: sts.latitude
                },
                max_jobs: 3
            }],
            vehicle_types: [{
                type_id: 'bus',
                capacity: [parseInt(vehicle.capacity)]
            }],
            shipments: [{
                id: uuidv4(),
                pickup: {
                    address: {
                        location_id: sts.locationId,
                        lon: sts.longitude,
                        lat: sts.latitude
                    }
                },
                delivery: {
                    address: {
                        location_id: landfill.locationId,
                        lon: landfill.longitude,
                        lat: landfill.latitude
                    }
                }
            }],
            objectives: [{
                type: 'min',
                value: 'vehicles'
            }, {
                type: 'min-max',
                value: 'completion_time'
            }],
            configuration: {
                routing: {
                    calc_points: true
                }
            }
        };

        const query = new URLSearchParams({
            key: '0981671d-e144-4a29-9ce0-812ff9084eaa'
        }).toString();

        const response = await fetch(https://graphhopper.com/api/1/vrp?${query}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;