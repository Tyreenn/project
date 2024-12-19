const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./config/sequelize");
const express = require("express");
const app = express();
const user = require("./models/user");

// To register a new user
app.post("/register", async() => {
 try {
//   Accept input from the body 
 const {name, email, password, role} = req.body;
//  check if all fields are filled 
if(!name || !email || !password || !role){
     return res.status(400).json({message : "please input all fields correctly"});
}
 const userExists = await user.findOne({where : {email}});
 if(!userExists){
     const harshedpassword = await bcrypt.harsh(password, 10);
     const newUser = {name, email, password : harshedpassword, role};
     await User.create(newUser);
     return res.status (201).json({message : "user created successfully"});
}
 return res.json({Message : "User already exists!"});
 
} catch (error) {
    console.log(error);
}
})
return res.status(500), json({ message: "" + message.error });

app.post("/login", async (req, res) => {
try {
  const { email, password } = req.body;
  const ifUserExists = await User.findOne({ where: { email } });

  if (!ifUserExists) {
    return res.status(404).json({ message: "Account doesn't exist" });
  }

  const checkPassword = await bcrypt.compare(password, ifUserExists.password);

  if (!checkPassword) {
    return res.status(403).json({ message: "Incorrect credentials" });
  }

  const accessToken = jwt.sign(
    {
      id: ifUserExists.id,
      name: ifUserExists.name,
      email: ifUserExists.email,
    },
    process.env.JWT_SECRET
  );

  console.log(accessToken);

  return res.status(200).json({ message: "Login Successful", accessToken });
} catch (error) {
  return res.status(500), json({ message: "" });
}
});

app.delete("/user/:id", async (req, res) => {
try {
  const id = req.params.id;
  const ifExist = await User.findOne({ where: { id } });

  if (ifExist) {
    await User.destroy({ where: { id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "User with this ID does not exist" });
  }
} catch (error) {
  return res
    .status(500)
    .json({ message: "Internal servver error " + error.message });
}
});

// TASK SECTION
app.post("/add-task", async (req, res) => {
try {
  const { title, description, status, due_date, createdFor } = req.body;
  const isUserValid = await User.findByPk(createdFor);

  if (!isUserValid) {
    return res
      .status(404)
      .json({ message: `User with ID: ${createdFor} does not exist` });
  }

  const createTask = {
    title,
    description,
    status,
    due_date,
    createdFor,
  };

  await Task.create(createTask);
  return res.status(200).json({ message: "Task successfully created" });
} catch (error) {
  return res.status(500).json({ message: "" + error.message });
}
});

app.put("/task/:taskId", async (req, res) => {
try {
  const { status, userId } = req.body;
  const { taskId } = req.params;

  const taskIdToNum = parseInt(taskId);
  if (isNaN(taskIdToNum)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const isUserValid = await User.findByPk(userId);
  const isTaskValid = await Task.findByPk(taskIdToNum);

  if (!status || !userId) {
    return res
      .status(400)
      .json({ message: "Status and userId are required" });
  }

  if (!isUserValid) {
    return res.status(404).json({ message: "User not found" });
  }

  if (isTaskValid) {
    if (
      isUserValid.role === "admin" ||
      isTaskValid.createdFor === isUserValid.id
    ) {
      try {
        await Task.update(
          {
            status: status,
          },
          {
            where: { id: taskIdToNum },
          }
        );
        return res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        return res.status(500).json({ message: "" + message.error });
      }
    } else {
      return res.status(400).json({
        message: "You do not have permission to update this task status",
      });
    }
  } else {
    return res.status(404).json({ message: "Task not found" });
  }
} catch (error) {
  return res.status(500).json({ message: +message.error });
}
});

app.delete("/delete-task/:taskId", async (req, res) => {
try {
  const { userId } = req.body;
  const { taskId } = req.params;

  const taskIdToNum = parseInt(taskId);
  if (isNaN(taskIdToNum)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const ifUserExists = await User.findByPk(userId);
  const ifTaskExists = await Task.findByPk(taskIdToNum);

  if (!ifUserExists) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (ifTaskExists) {
    if (
      ifUserExists.role === "admin" ||
      ifTaskExists.createdFor === ifUserExists.id
    ) {
      await Task.destroy({ where: { id: taskIdToNum } });
      return res.status(200).json({ message: "Task deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "You do not have permission to delete this task" });
    }
  } else {
    return res.status(400).json({ message: "Task does not exist" });
  }
} catch (error) {
  return res
    .status(500)
    .json({ message: "Internal servver error " + error.message });
}
});

// ADDING COMMENTS TO TASK
app.post("/task-comment", async (req, res) => {
try {
  const { comment, createdFor } = req.body;
  

  const ifTaskExists = await Task.findByPk(createdFor);
  if (ifTaskExists) {
    const newComment = {
      comment,
      createdFor,
    };
    await Comment.create(newComment);
    return res.status(200).json({ message: "Comment added successfully" });
  } else {
    return res.status(200).json({ message: "Task does not exist" });
  }
} catch (error) {
  return res.status(500).json({ message: "" + error.message });
}
});

app.put("/task-comment/:commentId", async (req, res)=>{
  const {comment, createdFor, createdBy} = req.body
  const {taskId} = req.params

  
})



app.listen(3000, async () => {
    try {
          await sequelize.sync();
          console.log(`the server is running on port 3000`);
    } catch (error) {
        console.log(error)
    }
});