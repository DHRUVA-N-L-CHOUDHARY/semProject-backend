const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const cityRoutes = require('./routes/cityRoutes');
const busRoutes = require('./routes/busRoutes');
const assistanceRequest = require('./routes/assistanceRequest');
const locationRecognitionRoutes = require('./routes/locationRecognition');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/assistanceRequest', assistanceRequest);
app.use("/api/location", locationRecognitionRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));

