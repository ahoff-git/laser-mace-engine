import { createServer } from 'http';
import { readFile } from 'fs';
import { join } from 'path';

const server = createServer((req, res) => {
  if (!req.url || req.url === '/' || req.url === '/index.html') {
    const filePath = join(__dirname, 'index.html');
    readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (req.url === '/app.js') {
    const filePath = join(__dirname, 'app.js');
    readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
