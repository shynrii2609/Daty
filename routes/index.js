var express = require('express');
var router = express.Router();

var dbconnet = 'mongodb+srv://admin:admin@cluster0.lvrs9.mongodb.net/Daty?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.connect(dbconnet, {useNewUrlParser: true, useUnifiedTopology: true});

var multer = require('multer');

var upload = multer({
   dest: '/public/uploads'
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('connected')
});

var User = new mongoose.Schema({
    name: String,
    birthday: String,
    email: String,
    number_phone: String,
    introduce: String,
    sex: String,
    interests: Array,
    images:Array
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});


router.post('/users',upload.single('images'), function (req, res, next) {
    var userConnect = db.model('Daty', User);
    userConnect({
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        number_phone: req.body.number_phone,
        introduce: req.body.introduce,
        sex: req.body.sex,
        interests: req.body.interests,
        images: req.file.filename



    }).save(function (error) {
        if (error) {
            res.render('./app.hbs')
        } else {
            res.render('./app.hbs');

        }
    })
    var userConnectFind = db.model('Daty', User);
    userConnectFind.find().then(function (User) {
        res.render('./app.hbs', {Daty: User})
    })


});
router.get('/getUsers', function (req, res, next) {
    var userConnectFind = db.model('Daty', User);
    userConnectFind.find().then(function (User) {
        res.render('./app.hbs', {Daty: User})
    })
});
router.get('/deleteUsers/:id',function (req,res) {

    db.model('Daty',User).deleteOne({ _id: req.params.id}, function (err) {
        if (err) {
            console.log('Lỗi')
        }

      res.redirect('../getUsers');

    });
})
router.post('/update', function(req, res, next) {
    var id = req.body.id;
    var userConnect = db.model('Daty', User);

    userConnect.findById(id, function(err, User) {
        if (err) {
            console.error('error, no entry found');
        }

        User.name = req.body.name;
        User.birthday = req.body.birthday;
        User.email = req.body.email;
        User.number_phone = req.body.number_phone;
        User.introduce = req.body.introduce;
        User.sex = req.body.sex;
        // User.interests = req.body.interests;

        User.save();
    })
    res.redirect('../getUsers');
});


module.exports = router;
