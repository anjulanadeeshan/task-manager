import express from "express";
import Todo from "../models/todo.model.js";
import mongoose from "mongoose";

const router = express.Router();

//Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//add a new todo
router.post("/", async (req, res) => {
  const todo = new Todo({
    text: req.body.text, // req.body must exist
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (e) {
    console.error("Error creating todo:", e); // <--- add this line to see error
    res.status(500).json({ message: e.message }); // send 500 instead of 400 for debugging
  }
});

//update a todo
router.patch("/:id", async(req,res)=>{
    try{
        const todo = await Todo.findById(req.params.id)
        if(!todo) return res.status(404).json({message : "todo not found"});
        if(req.body.text !== undefined) {
            todo.text = req.body.text;
        }
        const updatedTodo = await todo.save();

        res.json(updatedTodo);
    }catch(e){
        res.status(400).json({messge :e.message})
    }
})

//delete a todo
router.delete("/:id", async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({message: "invalid Todo id format"});
    }
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if(!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }
        res.json({message : "todo deleted!"})
    } catch(e){
        res.status(500).json({message: e.message});
    }
})
export default router;