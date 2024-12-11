/*
 Created by PistonCube
 Url: www.pistoncube.com.ar
 Git: github.com/PistonCube
 SourceCode: https://github.com/PistonCube/HidenCloud-PING
------------------------------*/

document.getElementById('pingButton').addEventListener('click', async () => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="text-center text-white">Pinging servers...</div>';
    
    const clientTimestamp = Date.now();
    try {
      const response = await fetch(`http://127.0.0.1:3000/ping?timestamp=${clientTimestamp}`);
      const data = await response.json();

      resultsDiv.innerHTML = `
        <h3 class="text-white">User Location: ${data.userLocation.city || 'Unknown'}</h3>
        <p class="text-white">Round Trip Time: ${data.timestamps.roundTrip}</p>
      `;

      data.results.forEach((server) => {
        const card = document.createElement('div');
        card.className = 'card text-white mb-3';
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${server.location}</h5>
            <p class="card-text">IP: ${server.ip}</p>
            <p class="card-text">Latency: ${server.latency}</p>
          </div>
        `;
        resultsDiv.appendChild(card);
      });
    } catch (error) {
      resultsDiv.innerHTML = '<div class="text-danger text-center">Error fetching data.</div>';
    }
  });
/*
 Created by PistonCube
 Url: www.pistoncube.com.ar
 Git: github.com/PistonCube
 SourceCode: https://github.com/PistonCube/HidenCloud-PING
------------------------------*/