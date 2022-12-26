const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date = require(__dirname+"/date.js")

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true }));
const items = [];
const workitems = [];

app.use(express.static("public"));

app.get("/", function(req, res){

    const day = date.getDate();
   
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

    res.render("list", {listTitle : day, newListItems: items});
});

app.post("/", function(req, res){
    
    // console.log(req.body);
    const item = req.body.newItem;

    if(req.body.list === "Work List "){
        workitems.push(item);
        res.redirect("/work");

    }else{        
        items.push(item);
        res.redirect("/");
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