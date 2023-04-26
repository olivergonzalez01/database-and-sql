const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const express = require('express');
const PORT = 8080;

// const db = [
//     {id: 0, product: 'shoes', desc: 'size 11', price: 100,
//     url: 'https://cdn.shopify.com/s/files/1/0064/2636/1946/products/5ba1073b8d4c964b9ff8769b-original_grande.jpg?v=1627025277',
//     reviews: [{name: 'phil', review: 'nice'}], error1: false, error2: false},
//     {id: 1, product: 'mug', desc: 'great for drinks', price: 5, url: 'https://media.endclothing.com/media/catalog/product/2/3/23-02-2021_JA_MA1248_1_1.jpg',
//     reviews: [{name: 'mean mugger', review: 'NOT MICROWAVE SAFE! 1/5'}, {name: 'test', review: 'one two one'}], error1: false, error2: false},
//     {id: 2, product: 'for sale sign', desc: 'people will run up to you', price: 9000, url: 'https://m.media-amazon.com/images/I/9177gW9JPlL._AC_SL1500_.jpg',
//     reviews: [{name: 'jeff', review: 'why so expensive?'}], error1: false, error2: false},
//     {id: 3, product: 'smartphone', desc: 'tiktok machine', price: 1000, url: 'https://img.buzzfeed.com/buzzfeed-static/static/campaign_images/webdr03/2013/4/24/7/your-smartphone-is-a-digital-prison-1-32758-1366801848-1_big.jpg?resize=1200:*',
//     reviews: [{name: 'steve', review: 'man i miss my old phone'}], error1: false, error2: false},
//     {id: 4, product: 'dole', desc: 'banana?', price: 1, url: 'https://consumerist.com/consumermediallc.files.wordpress.com/2012/06/gdcc3zin4dy.jpg',
//     reviews: [{name: 'cole the mole', review: 'yeah it was pretty good all things considered'}], error1: false, error2: false},
// ];

let db;
(async function () {
    db = await open ({
        filename: 'shopping.db',
        driver: sqlite3.Database
    });
})(); // connecting to the db file

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/items', async (req, res) => {
    res.render('items', {
        items: (await db.all('select * from Item'))
    });
});

app.get('/item_view/:index', async (req, res) => {
    let nameerror = false; let reviewerror = false;
    res.render('item_view', {
        items: (await db.all(`select * from Item where id = ${req.params.index}`)),
        reviews: (await db.all(`select * from Review where item_id = ${req.params.index}`)),
        nameerror, reviewerror
    });
});

app.post('/item_view/:index', async (req, res) => {
    if (req.params.index < 0 || req.params.index >= db.length) {
        res.sendStatus(404);
    }

    let nameerror = false; let reviewerror = false;
    const newreview = Object.assign({},req.body)
    console.log(newreview);
    if (newreview.name && newreview.review) {
        let result = await db.all("insert into Review (item_id, author, text) values (?, ?, ?)", newreview.item_id, newreview.name, newreview.review);
    }

    if (!newreview.name) {
        nameerror = true;
    }
    if (!newreview.review) {
        reviewerror = true;
    }

    res.render('item_view', {
        items: (await db.all(`select * from Item where id = ${req.params.index}`)),
        reviews: (await db.all(`select * from Review where item_id = ${req.params.index}`)),
        nameerror, reviewerror
    });
});

// app.post('/item_view/:index', (req, res) => {
//     db[req.params.index].error1 = false;
//     db[req.params.index].error2 = false;
//     if (req.body.id < 0 || req.body.id >= db.length) {
//         res.sendStatus(404);
//     }
//     if (req.body.name && req.body.review) {
//         let temp = {name: req.body.name, review: req.body.review};
//         db[req.body.id].reviews.push(temp);
//     }
//     if (!req.body.name) {
//         db[req.body.id].error1 = true;
//     }
//     if (!req.body.review) {
//         db[req.body.id].error2 = true;
//     }
//     res.render('item_view', {
//         items: db[req.body.id]
//     });
// })

app.get('/time', (req, res) => {
    const d = new Date();
    let text = d.toLocaleTimeString();
    res.send(`
    <html>
    <head><h1>The time is...</h1></head>
    <body>
    <p id="time"></p>
    ${text}
    </body>
    </html>
    `)
})

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
