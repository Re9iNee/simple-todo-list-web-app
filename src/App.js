import React from "react";
import "./styles/Tasks.css";
import "./styles/Buttons.css"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idCounter: 0,
      tasks: [{
        title: "Wash Clothes",
        id: 1,
        children: [{
          title: "Sport Clothes",
          id: 2,
        }, {
          title: "Casuals",
          id: 3
        }]
      }, {
        title: "Groceries",
        id: 4,
        children: []
      }, {
        title: "Fix Mac",
        id: 5,
        children: []
      }]
    };
  }
  handleKeyDown(event) { 
    // TODO: dblClick -> Rename
    const activeEl = document.querySelector("li:focus");
    // (onFocus)Ctrl + Shift + Delete | CMD + Delete -> Remove Task
    // TODO: dblCheck delete keyCode in Windows
    if (activeEl) {
      // Windows
      if (event.ctrlKey)
        if (event.shiftKey)
          if (event.keyCode === 8) {
            console.log("Remove a task")
            event.preventDefault();
          }

      // Mac
      if (event.metaKey)
        if (event.keyCode === 8) {
          console.log("Remove a task")
          event.preventDefault();
        }

      // (onFocus)Enter -> New Task
      // TODO: dblCheck enter KeyCode in windows
      if (event.keyCode === 13) {
        console.log("New Task")
        event.preventDefault();
      }

      // (onFocus)Tab -> Indent Outdent
      if (event.keyCode === 9) {
        event.preventDefault();
        // on tab keyDown
        const taskContainer = document.getElementById("taskContainer");
        const grandParentEl = activeEl.parentElement.parentElement;
        if (grandParentEl === taskContainer) {
          // Indent
          // TODO: don't Indent the Parent.
          const prevSibEl = activeEl.previousElementSibling;
          // if prevSibling exists: appendChild to previousSibling
          if (prevSibEl) {
            // if prevSibEl has ul child append to that otherwise create a new one
            const ulExist = prevSibEl.firstElementChild;
            if (ulExist) {
              ulExist.appendChild(activeEl)
            } else {
              const ul = document.createElement("ul");
              ul.appendChild(activeEl)
              prevSibEl.appendChild(ul);
            }
          }
          // else: Do Nothing
          // active element has no previous sibling to indent (OR one list item is only available)
        } else if (grandParentEl.tagName === "LI") {
          // Outdent
          grandParentEl.insertAdjacentElement("afterend", activeEl)
        }
        activeEl.focus()
      }


      // Documentation: Keyboard Navigation - Arrow Key Up.pdf
      // Priority List: PrevSibLastChild - PrevSib - Parent(GParent)
      if (event.keyCode === 38) {
        event.preventDefault();
        // Arrow Key Up
        try {
          // 1st Priority - prevSibLastChild
          const prevSibLastChild = activeEl.previousElementSibling.firstElementChild.lastElementChild;
          prevSibLastChild.focus()
        } catch {
          try {
            const prevSibEl = activeEl.previousElementSibling;
            prevSibEl.focus()
          } catch {
            try {
              const grandPaEl = activeEl.parentElement.parentElement;
              grandPaEl.focus()
            } catch {
              // Do Nothing
            }
          }
        }
      }
      // Documentation: Keyboard Navigation - Arrow Key Down.pdf
      // Priority List: Child - Next Sib - GParent Sib
      if (event.keyCode === 40) {
        event.preventDefault();
        // Arrow Key Down
        try {
          // 1st Priority - Child
          const childEl = activeEl.firstElementChild.firstElementChild;
          childEl.focus()
        } catch {
          try {
            // 2nd Priority - Next Sibling
            const nextSiblingEl = activeEl.nextElementSibling;
            nextSiblingEl.focus()
          } catch {
            try {
              // 3rd Priority - grandParentSibling
              const grandPaSibEl = activeEl.parentElement.parentElement.nextElementSibling;
              grandPaSibEl.focus()
            } catch {
              // Do Nothing
            }
          }
        }
      }
    }
    // Keyboard Navigation if we don't have any focused element
    else {
      event.preventDefault();
      const taskContainer = document.getElementById("taskContainer");
      if (event.keyCode === 38) {
        // Arrow Key Up
        taskContainer.firstElementChild.lastElementChild.focus()
      } else if (event.keyCode === 40) {
        taskContainer.firstElementChild.firstElementChild.focus()
      }
    }
    
  } 


  render() {
    window.addEventListener("keydown", this.handleKeyDown);
    return (
      <div>
        <div className="container" id="taskContainer">
          <ul>
            {/* <li tabIndex="0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quaerat officiis consequuntur aliquam? Corrupti officiis nemo commodi quas, ut assumenda quaerat unde! Nemo cum quidem, reiciendis deleniti sed commodi vel?</li>
            <li tabIndex="0">Odit ipsam repudiandae excepturi laudantium? A accusamus laborum autem doloremque, quos ea eius magnam exercitationem laudantium quidem error libero id quaerat incidunt. Quos est neque explicabo itaque veritatis dolorem culpa.
                <ul>
                    <li tabIndex="0">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni, libero voluptates officiis odit officia provident quas in voluptas id facere minima asperiores fuga! Magnam consequatur porro ratione laudantium iusto amet.</li>
                </ul>
            </li>
            <li tabIndex="0">Modi cumque commodi voluptate sit fugiat dicta mollitia totam unde, qui sunt sequi corporis ipsam, dolore aliquid harum dignissimos quis. Doloribus recusandae architecto laborum maxime alias quod enim dignissimos sit?</li> */}
            {this.state.tasks.map((task) => 
              <li tabIndex="0" key={task.id}>
                {task.title}
                {task.children.length > 1 && 
                  <ul>
                    {task.children.map((child) => <li key={child.id} tabIndex="0">{child.title}</li>)}
                  </ul>
                  }
                </li>
              )}
          </ul>
        </div>
        <div className="btn-groups">
            <button className="btn primary-btn" id="addBtn">Add New</button>
        </div>
      </div>
    )
  }
}


export default App;
