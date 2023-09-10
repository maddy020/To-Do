const express=require("express");
const app=express();
const fs=require("fs");
const bodyParser=require("body-parser"); 
const port=3000;

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("WELCOME TO YOUR TO-DO APPLICATION SERVER");
})

let todos=[];

function gettingTodos(req,res){
    fs.readFile("a.json","utf-8",((err,data)=>{
        if (err) {
            console.log("Error occured in reading the file")
        }
        res.json(JSON.parse(data));
     }))
  
}

function deleteTodo(req,res){
    const id = parseInt(req.params.id);
    const todos=[];
    const todoind=-1;
    fs.readFile("a.json","utf-8",((err,data)=>{
        if(err)console.log(err);
        const todos=JSON.parse(data);
        const todoind=todos.findIndex((t)=>t.id===parseInt(req.params.id));
        if(todoind==-1){
            res.status(404).send();
        }
        else{
            todos.splice(todoind,1);
        }
        fs.writeFile("a.json",JSON.stringify(todos),(err)=>{
            if(err)console.log("ERROR IN WRITING AFTER DELETION");
            else res.status(200).send();
        });
       
    }));

   
};

function getTodo(req,res){
    const id = parseInt(req.params.id); // Parse the id to an integer
    fs.readFile("a.json","utf-8",((err,data)=>{
       if(err)throw err;
       else {
        const todos=JSON.parse(data);
        const todo=todos.find((t)=>t.id===id);
        if(!todo){
            res.status(404).send("No such todo exist")
          }
          else{
            res.send(todo.title);
          }
       }
    }))
};


function createTodo(req, res) {
    const newtodo = {
        "title": req.body.title,
        "description": req.body.description,
        "completed": req.body.completed,
        "id": Math.floor(Math.random() * 1000),
    };

    fs.readFile("a.json", "utf-8", (err, data) => { // Corrected callback function parameters
        if (err) {
            console.log("error 1");
        }  
 
        let todos=[];

        if (fs.existsSync("a.json")) {
            // Get the file's stats
            const stats = fs.statSync("a.json");
          
        
            // Check if the file is empty (has zero size)
            if (stats.size !== 0) {
               todos=JSON.parse(data);
            }}
            todos.push(newtodo);

            fs.writeFile("a.json", JSON.stringify(todos), (err) => {
                if (err) {
                    console.log("error 2");
                } else {
                    res.status(201).json(newtodo);
                }
            });
    });
}
function updatetask(req,res){
    const id=parseInt(req.params.id);
    
    fs.readFile("a.json","utf-8",(err,data)=>{
        if(err)console.error(err);
        const todos=JSON.parse(data);
        const todoind=todos.findIndex((t)=>t.id===id);
        if(todoind==-1)res.status(404).send();
        else{
            todos[todoind].title=req.body.title;
            todos[todoind].description=req.body.description;
            res.json(todos[todoind]);
        }
        fs.writeFile("a.json",JSON.stringify(todos),(err)=>{
            if(err)console.error(err);
            res.status(200).send();
        })
    })
    
    
}

app.get("/todos",gettingTodos);
app.get("/todos/:id",getTodo);
app.post("/create",createTodo);
app.delete("/delete/:id",deleteTodo);
app.put("/update/:id",updatetask);

app.listen(port,()=>{
    console.log(`Server is running at port number ${port}`)
})