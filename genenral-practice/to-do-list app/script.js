let folders = JSON.parse(localStorage.getItem("todoFolders")) || {};
let currentFolder = null;


function saveFolders() {
  localStorage.setItem("todoFolders", JSON.stringify(folders));
}

function createFolder() {
  const name = document.getElementById("folderName").value.trim();
  if (!name || folders[name]) return;
  folders[name] = [];
  document.getElementById("folderName").value = "";
  saveFolders();
  renderFolders();
}

function renderFolders() {
  const folderList = document.getElementById("folderList");
  folderList.innerHTML = "";

  Object.keys(folders).forEach(folder => {
    const li = document.createElement("li");
    li.classList.add("folder-item");

    // Checkbox (for marking folder "done")
    const checkbox = document.createElement("input");
     checkbox.classList.add("checkbox");

    checkbox.type = "checkbox";
    checkbox.style.marginRight = "10px";

    // Folder Name Text
    const folderSpan = document.createElement("span");
    folderSpan.classList.add("folder-name");

    folderSpan.textContent = folder;
    folderSpan.style.marginRight = "10px";
    folderSpan.style.cursor = "pointer";
    folderSpan.onclick = () => openFolder(folder);


    


    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");

    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      const newName = prompt("Rename folder:", folder);
      if (newName && !folders[newName]) {
        folders[newName] = folders[folder];
        delete folders[folder];
        saveFolders();
        renderFolders();
        if (currentFolder === folder) openFolder(newName);
      }
    };

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");

    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      if (confirm(`Delete folder "${folder}"?`)) {
        delete folders[folder];
        saveFolders();
        renderFolders();
        document.getElementById("taskSection").style.display = "none";
      }
    };




    // Append all to list item
    li.appendChild(checkbox);
    li.appendChild(folderSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    folderList.appendChild(li);
  });
}


 function openFolder(folder) {
      currentFolder = folder;
      document.getElementById("taskSection").style.display = "block";
      document.getElementById("currentFolderName").textContent = folder;
      renderTasks();
    }

    function addTask() {
      const taskInput = document.getElementById("taskInput");
      const task = taskInput.value.trim();
      if (!task) return;
      folders[currentFolder].push({ text: task, done: false });
      taskInput.value = "";
      saveFolders();
      renderTasks();
    }

   function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  folders[currentFolder].forEach((taskObj, index) => {
    const li = document.createElement("li");
    li.classList.add("folder-item");

    const checkbox = document.createElement("input");
    checkbox.classList.add("checkbox");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "10px";
    checkbox.checked = taskObj.done;

    checkbox.onchange = () => {
      taskObj.done = checkbox.checked;
      saveFolders();
      renderTasks();
      updateFolderCheckbox(currentFolder);
    };

    const taskSpan = document.createElement("span");
    taskSpan.classList.add("folder-name");
    taskSpan.textContent = taskObj.text;
    taskSpan.style.marginRight = "10px";

    // ✏️ Edit Button becomes Save/Edit toggle
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "✏️";

    let editing = false; // flag to track mode

    editBtn.onclick = () => {
      if (!editing) {
        // Switch to input mode
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskObj.text;
        input.style.marginRight = "10px";
        input.classList.add("edit-input");

        li.replaceChild(input, taskSpan);
        editBtn.textContent = "✅";
        editing = true;

      } else {
        // Save and switch back to text mode
        const input = li.querySelector(".edit-input");
        const newText = input.value.trim();

        if (newText) {
          taskObj.text = newText;
          saveFolders();
        }

        taskSpan.textContent = taskObj.text;
        li.replaceChild(taskSpan, input);
        editBtn.textContent = "✏️";
        editing = false;
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      folders[currentFolder].splice(index, 1);
      saveFolders();
      renderTasks();
      updateFolderCheckbox(currentFolder);
    };

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function updateFolderCheckbox(folder) {
  const allDone = folders[folder].length > 0 && folders[folder].every(task => task.done);
  
  // Find the folder list item and check its checkbox if all tasks are done
  const folderItems = document.querySelectorAll("#folderList .folder-item");
  folderItems.forEach(li => {
    const span = li.querySelector(".folder-name");
    const checkbox = li.querySelector(".checkbox");
    if (span && checkbox && span.textContent === folder) {
      checkbox.checked = allDone;
    }
  });
}

// Press Enter to create a folder
document.getElementById("folderName").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    createFolder();
  }
});

// Press Enter to add a task
document.getElementById("taskInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});





    // Initial render on load
    renderFolders();