var express = require('express');
var router = express.Router();
var fs = require('fs');


var dbconnet = 'mongodb+srv://admin:admin@cluster0.lvrs9.mongodb.net/Daty?retryWrites=true&w=majority';

const bodyParser = require('body-parser');
router.use(bodyParser.json());


const mongoose = require('mongoose');
mongoose.connect(dbconnet, {useNewUrlParser: true, useUnifiedTopology: true});

const multer = require('multer');


const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, './public/uploads/images')
    },

    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

router.use(express.static('uploads/'));

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
    // interests: Array,
    images:String,
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');


});
router.get('/users', function (req, res, next) {

    var userConnect = db.model('Daty', User);

    userConnect.find({}, function (error, User) {
        var type = 'index';
        try {
            type = req.query.type;
        } catch (e) {
        }
        if (error) {
            res.render('app', {title: 'Express : ' + error});
            return
        }
        if (type == 'json') {
            res.send(User)
        } else {
            res.render('app', {title: 'Express', Daty: User});
        }

    })
});

router.post('/users', upload.single('image'), async function (req, res, next) {

    if (!req.body.name) {
        return  res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    }else{
        res.status(200).json({
            status: 'succes',
            data: req.body,
        })
    }

    var userConnect = db.model('Daty', User);
    userConnect({
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        number_phone: req.body.number_phone,
        introduce: req.body.introduce,
        sex: req.body.sex,
        // interests: req.body.interests,


    }).save(function (error) {
        if (error) {
            res.render('app')
        } else {
            res.render('app')
        }
    })
    var userConnectFind = db.model('Daty', User);
    userConnectFind.find().then(function (User) {
        res.render('app', {Daty: User})


    })
});

router.get('/getUsers', function (req, res, next) {
    var userConnectFind = db.model('Daty', User);
    userConnectFind.find().then(function (User) {
        res.render('./app.hbs', {Daty: User})
    })

});


router.post('/deleteUsers/:id', function (req, res) {


    db.model('Daty', User).deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            console.log('Lỗi')
        }
        res.redirect('../getUsers');
    });

})

router.post('/update', function (req, res, next) {
    if (!req.body.name) {
        return  res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    }else{
        res.status(200).json({
            status: 'succes',
            data: req.body,
        })
    }
    var id = req.body.id;
    var userConnect = db.model('Daty', User);

    userConnect.findById(id, function (err, User) {
        if (err) {
            console.error('error, no entry found');
        }

        User.name = req.body.name;
        User.birthday = req.body.birthday;
        User.email = req.body.email;
        User.number_phone = req.body.number_phone;
        User.introduce = req.body.introduce;
        // User.sex = req.body.sex;
        // User.interests = req.body.interests;

        User.save();
    })
    res.redirect('../getUsers');
});


module.exports = router;
