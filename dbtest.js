const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

console.log ("connecting to the database...");
async function connect() {
    const db = await open ({
        filename: 'shopping.db',
        driver: sqlite3.Database
    });
    console.log("connected");
    console.log("printing Item and Review...");
    let result = await db.all("select * from Item");
    console.log(result);
    result = await db.all("select * from Review");
    console.log(result);
    console.log();

    console.log("select by id:");
    result = await db.all("select * from Review where item_id = 3");
    console.log(result);

    console.log("insert");
    result = await db.all("insert into Item (name, description) values ('another thing', 'another desc')");
    result = await db.all("select * from Item");
    console.log(result);

    console.log("delete by id");
    result = await db.all("delete from Item where id = 1");
    result = await db.all("select * from Item");
    console.log(result);

    console.log("update by id");
    result = await db.all("update Review set author = 'nobody', text = 'what item?' where item_id = 1");
    result = await db.all("select * from Review where item_id = 1");
    console.log(result);

    console.log("select join");
    result = await db.all("select Item.id, Item.name, Review.text from Item inner join Review on Review.item_id=Item.id");
    console.log(result);
}
connect();
//parameterized query something something
