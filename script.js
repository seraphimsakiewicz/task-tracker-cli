const fs = require("fs");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const dataPath = "./data.json";

const getData = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const addTask = (input) => {
  const description = input.match(/^add\s+(.*)/)[1];
  const newData = [...getData()];
  const newItem = {
    id: newData.length + 1,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  newData.push(newItem);
  saveData(newData);
};

const listTasks = () => {
  console.log("listing tasks...");
};

const deleteTask = (input) => {
  const id = input.match(/^delete\s+(.*)/)[1];
  const newData = [...getData()].filter((item) => item.id !== Number(id));
  saveData(newData);
};

const startPrompt = () => {
  const rl = readline.createInterface({ input, output });
  let openConnection = true;

  rl.on("line", (input) => {
    if (input === "exit") {
      openConnection = false;
      rl.close();
    } else if (input.includes("add")) {
      addTask(input);
    } else if (input.includes("delete")) {
      deleteTask(input);
    } else {
      console.log("invalid input, please try again");
    }
  });
};

// Create a new file if it doesn't exist
if (!fs.existsSync(dataPath)) {
  /* Create an empty file, wx flag tells Node to create the file if it doesn't exist and fail if it does. */
  fs.writeFile(dataPath, "[]", { flag: "wx" }, function (err) {
    if (err) console.err(err);
    console.log(`Data file not found at ${dataPath}, saving it at ${dataPath}`);
    startPrompt();
  });
} else {
  startPrompt();
}
