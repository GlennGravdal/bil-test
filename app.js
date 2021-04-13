const mysql = require("mysql");
const express = require("express");

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_uke_4_kopi'
})

db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log("MYSQL connected yay")
    }
})

//app.set('view engine', 'ejs')

app.use(express.urlencoded( {extended: false}))

app.get('/', (req, res) => {
    console.log("Inne i /")
    res.send("<h1>Hjemmesiden</h1>")
})

app.get('/biler', (req, res) => {
    console.log("Inne i /biler")

    db.query("SELECT * FROM bil", function (req, result) {
        if(result) {
            //console.table(result)
            res.render("biler.ejs", {
                obj: result
            })
        }
    } )
})

app.get('/biler/:ID', (req, res) => {
    console.log("Inne i /biler/:ID")

    db.query(`SELECT * FROM bil WHERE ID = ${req.params.ID}`, function (req, result) {
        if(result) {
            res.render("biler.ejs", {
                obj: result
            })
        }
    })
})

app.post('/biler/ny', (req, res) => {
    var nyBil = {
        merke: req.body.merke,
        modell: req.body.modell,
        kjørelengde: req.body.kjørelengde,
        pris: req.body.pris,
        produksjonsår: req.body.produksjonsår,
        drivstoff: req.body.drivstoff,
        bilforhandler_id: req.body.bilforhandler_id,
        kommentar: req.body.kommentar,
        link: req.body.link
    }
    //console.table(nyBil)

    db.query('INSERT INTO bil SET ?', nyBil, (err, result) => {

        if (err) throw err

        res.render('nyBil.ejs')
    })
})

app.post('/search', (req, res) => {
    var info = {
        søkefelt: req.body.searchField,
        kategori: req.body.kategori
    }

    console.log("Søkelfelt: " + info.søkefelt)
    let queryString = `SELECT * FROM bil WHERE ${info.kategori} LIKE "%${info.søkefelt}%"`
    db.query(queryString, (err, result) => {
        console.log(queryString);
        if (err) throw err

        res.render('biler.ejs', {
            obj: result
        }
        )
    })
})


app.get('/biler/slett/:ID', (req, res) => {
    let queryString = `DELETE FROM bil WHERE ID = ${req.params.ID}` 
    console.log(queryString)
    db.query(queryString, (err, result) => {
        if(err) throw err

        res.render('slettBil.ejs')

    })
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})