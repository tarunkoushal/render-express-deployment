const express = require("express");
const app = express();
const port = 4000;

let items = [];

app.set("view engine", "ejs");

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));


// --- ROUTES ---

app.get("/", function(req, res) {
    res.render("list", { todoItems: items });
});

app.post("/add", function(req, res) {
    const newItemText = req.body.newItem;
    if (newItemText) {
        // MODIFICATION: Add the 'editing' property to new items.
        items.push({ text: newItemText, completed: false, editing: false });
    }
    res.redirect("/");
});

app.post("/update", function(req, res) {
    const itemIndex = req.body.checkbox;
    if (items[itemIndex]) {
        items[itemIndex].completed = !items[itemIndex].completed;
    }
    res.redirect("/");
});

// --- NEW ROUTES FOR EDIT AND DELETE ---

// Route to handle deleting an item
app.post("/delete", function(req, res) {
    const itemIndex = req.body.itemIndex;
    if (itemIndex && items[itemIndex]) {
        // Use splice to remove the item from the array
        items.splice(itemIndex, 1);
    }
    res.redirect("/");
});

// Route to switch an item to "editing" mode
app.post("/edit", function(req, res) {
    const itemIndex = req.body.itemIndex;

    // To prevent multiple items being in edit mode, first reset all.
    items.forEach(item => item.editing = false);

    if (items[itemIndex]) {
        items[itemIndex].editing = true;
    }
    res.redirect("/");
});

// Route to save the updated text of an item
app.post("/save", function(req, res) {
    const { itemIndex, updatedText } = req.body;
    if (items[itemIndex]) {
        items[itemIndex].text = updatedText;
        items[itemIndex].editing = false; // Turn off editing mode
    }
    res.redirect("/");
});


app.listen(port, function() {
    console.log(`Server started successfully on port ${port}`);
});