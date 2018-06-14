const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const app = express();

Object.assign(_.templateSettings, {
  escape: /<%%-([\s\S]+?)%%>/g,
  evaluate: /<%%([\s\S]+?)%%>/g,
  interpolate: /<%%=([\s\S]+?)%%>/g
});

let prebidTemplate = _.template(fs.readFileSync('./z-prebid-template.js', 'utf-8'));

app.get('/prebid.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  return res.send(prebidTemplate(Object.assign(
    JSON.parse(fs.readFileSync('./z-prebid-config.json', 'utf-8')),
    {
      prebid: fs.readFileSync('./build/dev/prebid.js', 'utf-8')
    }
  )));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
