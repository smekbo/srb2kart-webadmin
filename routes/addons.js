var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/upload', (req, res, next) => 
{
  console.log(req);
  fs.writeFile(`public/addons/${req.files.addon.name}`, req.files.addon.data, (err) => 
  {
    if (!err)
    {
      res.send(200);
    }
  })
})

router.get('/get', (req, res, next) => 
{
  fs.readdir("public/addons", (err, files) =>
  {
    let data = []

    files.forEach( (file) => 
    {
      let reg = /(^.*)\.(lua|pk3|wad)$/;

      let r = reg.exec(file);

      if (r)
      {
        let filename = r[1];
        let extension = r[2];
        data.push(
        {
          filename : filename,
          extension : extension
        });
      }
    })
    data = JSON.stringify(data);
    res.send(data);
  })  
})

module.exports = router;
