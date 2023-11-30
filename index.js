import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "postgres2023",
  database: "udemy"
});

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/",async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items order by id ASC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("Insert into items (title) values ($1)",[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const item = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items set title = ($1) WHERE id = $2",[item,id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items where id = $1",[id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
