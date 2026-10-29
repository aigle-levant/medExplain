const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Hardcoded mock data for hospitals in Tamil Nadu (Chennai & surrounding areas)
const hospitals = [
  {
    id: 1,
    name: "Sir Ivan Stedeford Hospital",
    rating: 4.5,
    totalReviews: 2150,
    distanceKm: 3.2,
    address: "Chennai - Tiruvallur High Rd, Ambattur, Chennai, Tamil Nadu 600053",
    contact: "+91 44 2638 0303",
    emergencyAvailable: true,
    location: {
      latitude: 13.1118,
      longitude: 80.1583
    }
  },
  {
    id: 2,
    name: "Sri Ramachandra Medical Centre (SRMC)",
    rating: 4.8,
    totalReviews: 5420,
    distanceKm: 9.8,
    address: "No.1 Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116",
    contact: "+91 44 4592 8500",
    emergencyAvailable: true,
    location: {
      latitude: 13.0392,
      longitude: 80.1485
    }
  },
  {
    id: 3,
    name: "MIOT International",
    rating: 4.6,
    totalReviews: 4890,
    distanceKm: 11.4,
    address: "4/112, Mount Poonamallee Rd, Manapakkam, Chennai, Tamil Nadu 600089",
    contact: "+91 44 4200 2288",
    emergencyAvailable: true,
    location: {
      latitude: 13.0163,
      longitude: 80.1802
    }
  },
  {
    id: 4,
    name: "Apollo Hospitals",
    rating: 4.7,
    totalReviews: 8900,
    distanceKm: 14.5,
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006",
    contact: "+91 44 2829 0200",
    emergencyAvailable: true,
    location: {
      latitude: 13.0604,
      longitude: 80.2523
    }
  },
  {
    id: 5,
    name: "Rajiv Gandhi Government General Hospital",
    rating: 4.2,
    totalReviews: 3100,
    distanceKm: 18.1,
    address: "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003",
    contact: "+91 44 2530 5000",
    emergencyAvailable: true,
    location: {
      latitude: 13.0827,
      longitude: 80.2750
    }
  },
  {
    id: 6,
    name: "Kauvery Hospital",
    rating: 4.7,
    totalReviews: 3450,
    distanceKm: 19.5,
    address: "199, Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004",
    contact: "+91 44 4000 6000",
    emergencyAvailable: true,
    location: {
      latitude: 13.0375,
      longitude: 80.2586
    }
  }
];

// GET /api/hospitals - Retrieve hospitals with optional sorting and limiting
app.get('/api/hospitals', (req, res) => {
  const { sortBy, limit } = req.query;
  let results = [...hospitals];

  if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  const parsedLimit = parseInt(limit, 10);
  if (!isNaN(parsedLimit) && parsedLimit > 0) {
    results = results.slice(0, parsedLimit);
  }

  res.status(200).json({
    status: 'success',
    count: results.length,
    data: results
  });
});

// GET /api/hospitals/:id - Retrieve a specific hospital by ID
app.get('/api/hospitals/:id', (req, res) => {
  const hospitalId = parseInt(req.params.id, 10);
  const hospital = hospitals.find((h) => h.id === hospitalId);

  if (!hospital) {
    return res.status(404).json({
      status: 'fail',
      message: `Hospital with ID ${hospitalId} not found`
    });
  }

  res.status(200).json({
    status: 'success',
    data: hospital
  });
});

app.listen(PORT, () => {
  console.log(`Healthcare prototype server running at http://localhost:${PORT}`);
});