const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/hw1/:string', function (req, res, next) {
    const string = req.params.string;

    const length = string.length;

    res.json({string: string, length: length})

});

router.post('/hw1Post', function (req, res, next) {
    const string = req.body.string;

    const length = string.length;

    res.json({string: string, length: length})
});

module.exports = router;
