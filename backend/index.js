/*
 Created by PistonCube
 Url: www.pistoncube.com.ar
 Git: github.com/PistonCube
 SourceCode: https://github.com/PistonCube/HidenCloud-PING
------------------------------*/

const express = require('express');
const ping = require('ping');
const geoip = require('geoip-lite');
const fs = require('fs');
const cors = require('cors');

const app = express();

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));
const PORT = config.port || 3000;
const servers = config.servers || [];

app.use(cors());

app.use((req, res, next) => {
  req.userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Detected IP: ${req.userIP}`);
  next();
});

app.get('/ping', async (req, res) => {
  const clientTimestamp = parseInt(req.query.timestamp, 10);
  const serverTimestamp = Date.now();

  if (!clientTimestamp) {
    return res.status(400).json({ error: 'Client timestamp is required' });
  }

  const userLocation = geoip.lookup(req.userIP) || { city: 'Unknown', region: 'Unknown', country: 'Unknown' };

  try {
    const results = await Promise.all(
      servers.map(async (server) => {
        const pingResult = await ping.promise.probe(server.ip);
        const latency = pingResult.avg ? parseFloat(pingResult.avg) : null;

        return {
          location: server.location,
          ip: server.ip,
          latency: latency ? `${latency} ms` : 'Timeout',
        };
      })
    );

    res.json({
      userLocation,
      results,
      timestamps: {
        client: clientTimestamp,
        server: serverTimestamp,
        roundTrip: `${serverTimestamp - clientTimestamp} ms`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error performing ping." });
  }
});

app.use(express.static('frontend'));

app.listen(PORT, () => {
  console.log(`API running at http://127.0.0.1:${PORT}`);
});

/*
 Created by PistonCube
 Url: www.pistoncube.com.ar
 Git: github.com/PistonCube
 SourceCode: https://github.com/PistonCube/HidenCloud-PING
------------------------------*/