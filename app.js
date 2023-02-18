const express = require("express");
const mongoose = require ('mongoose');
const bodyParser = require("body-parser");
const _ = require('lodash');

const { urlencoded } = require("body-parser");
// const date = require(__dirname+"/date.js")

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true }));
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://admin-debanik:test123@cluster0.4piso87.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String,
  });
  
  const Item = mongoose.model("item", itemsSchema);
  
  const item1 = new Item({
    name : "Welcome to your todo list!"
  });
  const item2 = new Item({
    name : "<--Hit the ++ button to add new tasks"
  });
  const item3 = new Item({
    name : "<-- Hit this to delete an item"
  });
  
  const defaultItems = [item1, item2, item3];
  
  
  const items = [];
  const workitems = [];
  
  app.use(express.static("public"));
  
  app.get("/", function(req, res){
    
    // const day = date.getDate();
    
    // const today = new Date();
    // const currentDay = today.getDay();
    // const day = "";

    // switch(currentDay){
      //     case 0:
    //         day = "Sunday";
    //         break;
    //     case 1:
    //         day = "Monday";
    //         break;
    //     case 2:
    //         day = "Tuesday";
    //         break;
    //     case 3:
    //         day = "Wednesday";
    //         break;
    //     case 4:
    //         day = "Thursday";
    //         break;
    //     case 5:
    //         day = "Friday";
    //         break;
    //     case 6:
    //         day = "Saturday";
    //         break;
    //     default:
    //         console.log("ERROR: Current day is equal to : "+ currentDay);
    // }

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
        if(err) console.log(err);
        else console.log("Successfully saved to the array");
        });
        res.redirect("/");
        }
        else{
        res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
        });
    });
    
    const listSchema = {
      name: String, 
      items: [itemsSchema]
    };


    const List = mongoose.model("list", listSchema);


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  
  
  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //Create a new list
        const list = new List({
          name: customListName, 
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else{
        
        res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
      } 
    }    
  });
  
  
  
});

app.post("/", function(req, res){
    
    // console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
      name : itemName
    });

    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }else{
      List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
          });
        }
      });

    // item.save();

    // res.redirect("/")

    // if(req.body.list === "Work List "){
    //     workitems.push(item);
    //     res.redirect("/work");
        
    //   }else{        
    //     items.push(item);
    //     res.redirect("/");
    //   }

// });

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err) console.log(err);
      else console.log("Item deleted successfully");
      res.redirect("/");
    });
  }
    else{
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundItems){
        if(!err){
          res.redirect("/"+ listName);
        }
      })
    }
  
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workitems});
});

app.get("/about", function(req, res){
    res.render("about");
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});