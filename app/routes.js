
const fetch = require("node-fetch");

module.exports = function(app, passport, db, ObjectId) {
  // const fetch = require("node-fetch");

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      var uId = req.user._id
      console.log(uId)
        db.collection('bills').find({createdBy: uId}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            bills: result
          })
        })
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================
//  new collection to keep a running total
    app.post('/bills', (req, res) => {
      db.collection('bills').save({name: req.body.name, price: req.body.price, thumbUp: req.body.thumbUp, createdBy: req.user._id, totalBills: req.body.totalBills}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')

        res.redirect('/profile')
      })
    })

    // app.put('/total', (req, res) => {
    //   console.log(req)
    //   let listOfBills = document.getElementsByClassName('messages')
    //   console.log(listOfBills)
    //   let listOfAllTheBills = []
    //   for(let i = 0; i<listOfBills[0].children.length; i++){
    //     let valueOfBills = parseInt(listOfBills[0].children[i].childNodes[3].innerText)
    //     listOfAllTheBills.push(valueOfBills)
    //     console.log(listOfAllTheBills)
    //     const reducer = (accumulator, currentValue) => accumulator + currentValue;
    //     // console.log(listOfAllTheBills.reduce(reducer));
    //     let totalPricOfBills = listOfAllTheBills.reduce(reducer)
    //   }
    //   db.collection('bills')
    //   .findOneAndUpdate({name: req.body.name, price: req.body.price, thumbUp:req.body.thumbUp}, {
    //     $set: {
    //       totalBills: totalP
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })







    app.put('/bills', (req, res) => {
      console.log(req)
      db.collection('bills')
      .findOneAndUpdate({name: req.body.name, price: req.body.price}, {
        $set: {
          thumbUp:req.body.thumbUp
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })


    // app.put('/addTotal',(req, res)=> {
    //   db.collection('messages').findOneAndUpdate({createdBy: req.user._id})
    // })

    app.delete('/bills', (req, res) => {
      db.collection('bills').findOneAndDelete({name: req.body.name, price: req.body.price}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  // console.log(req)
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
