const http = require('http');
const { exec } = require('child_process');

const PORT = 3737;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'PromptForge Local Bridge' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/run-command') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const command = data.command;
        const cwd = data.cwd || process.cwd();

        if (!command) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Command missing' }));
          return;
        }

        console.log(`[PromptForge Bridge] Exécution de : ${command} dans ${cwd}`);
        
        // Sur Windows, ouvrir une nouvelle fenêtre CMD pour voir les logs du dev server
        const isWin = process.platform === 'win32';
        const cmdToRun = isWin ? `start cmd /k "${command}"` : command;

        exec(cmdToRun, { cwd }, (error) => {
          if (error) {
            console.error(`[Erreur] ${error.message}`);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'started', command }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 PromptForge Bridge Local démarré sur http://localhost:${PORT}`);
  console.log(`👉 Tu peux désormais exécuter directement les commandes npm depuis PromptForge !\n`);
});
