const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/upload', (req, res) => {
  let fn = req.body.fn.split("..").join("");
  let fileDest = __dirname + '/doc/' + fn;
  let fileContent = req.body.content;

  fs.writeFile(fileDest, fileContent, (err) => {
    if(err) res.status(500);
    console.log(`File ${fileDest} is saved`);
    res.status(200);
  });
  res.status(200);
});

app.get('/ls', (req, res) => {
  fs.readdir('doc', (err, files) => {
    if(err) res.status(500);
    res.status(200).json({
      list: files
    });
  });
})

app.post('/cat', (req, res) => {
  let fn = req.body.fn;
  let dest = `doc/${fn}`;

  fs.readFile(dest, 'utf8', (err, data) => {
    if(err) res.status(500);
    res.status(200).json({
      content: data
    })
  })
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

