import React from "react";
import "./styles/Buttons.css";
import Modal from "./Modal";
import Tasks from "./Tasks";
import database from "./database";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idCounter: 0,
      showModal: false,
      mode: 0,
      // 0 for read, 1 for create, 2 for update
      tasks: [],
      // localStorage obj
      storage: new database(props.url),
      parentId: null,
    };
    // deactive modal from Child Components
    this.deactivateModal = this.deactivateModal.bind(this);
  }
  handleKeyDown(event) {
    // TODO: on(Escape) key close modal
    // TODO: bring back preventDefaults()
    const activeEl = document.querySelector("li:focus");
    // (onFocus)Ctrl + Shift + Delete | CMD + Delete -> Remove Task
    // TODO: dblCheck delete keyCode in Windows
    if (activeEl) {
      // Documentation: Keyboard Navigation - Arrow Key Up.pdf
      // Priority List: PrevSibLastChild - PrevSib - Parent(GParent)
      if (event.keyCode === 38) {
        // event.preventDefault();
        // Arrow Key Up
        try {
          // 1st Priority - prevSibLastChild
          const prevSibLastChild =
            activeEl.previousElementSibling.firstElementChild.lastElementChild;
          prevSibLastChild.focus();
        } catch {
          try {
            const prevSibEl = activeEl.previousElementSibling;
            prevSibEl.focus();
          } catch {
            try {
              const grandPaEl = activeEl.parentElement.parentElement;
              grandPaEl.focus();
            } catch {
              // Do Nothing
            }
          }
        }
      }
      // Documentation: Keyboard Navigation - Arrow Key Down.pdf
      // Priority List: Child - Next Sib - GParent Sib
      if (event.keyCode === 40) {
        // event.preventDefault();
        // Arrow Key Down
        try {
          // 1st Priority - Child
          const childEl = activeEl.firstElementChild.firstElementChild;
          childEl.focus();
        } catch {
          try {
            // 2nd Priority - Next Sibling
            const nextSiblingEl = activeEl.nextElementSibling;
            nextSiblingEl.focus();
          } catch {
            try {
              // 3rd Priority - grandParentSibling
              const grandPaSibEl =
                activeEl.parentElement.parentElement.nextElementSibling;
              grandPaSibEl.focus();
            } catch {
              // Do Nothing
            }
          }
        }
      }
    }
    // Keyboard Navigation if we don't have any focused element
    else {
      // event.preventDefault();
      const taskContainer = document.getElementById("taskContainer");
      if (event.keyCode === 38) {
        // Arrow Key Up
        taskContainer.firstElementChild.lastElementChild.focus();
      } else if (event.keyCode === 40) {
        taskContainer.firstElementChild.firstElementChild.focus();
      }
    }
  }

  create = (event, parentId = null) => {
    event.stopPropagation();
    this.setState({
      showModal: true,
      mode: 1,
      parentId: parentId,
    });
  };
  update = (event, id, title) => {
    this.setState({
      showModal: true,
      mode: 2,
      tempId: id,
      tempTitle: title,
    });
  };
  delete = (event, id) => {
    this.state.storage.delete(id);
    this.setState({
      refresh: true,
    });
  };

  deactivateModal(event) {
    this.setState({
      showModal: false,
    });
  }

  static getDerivedStateFromProps(props, state) {
    // 1
    // state.storage.remove()
    return {
      tasks: state.storage.get(),
      // make this id unique
      idCounter: state.storage.getLastId() + 1,
    };
  }

  render() {
    window.addEventListener("keydown", this.handleKeyDown);
    return (
      <div>
        <div
          className="container"
          id="taskContainer"
          data-test="task-container"
          // TODO: the state will update even by a single click (even if modal is not activated )
          onClick={(ev) => this.deactivateModal("myModal", ev)}
        >
          <Tasks
            tasks={this.state.tasks}
            onCreate={this.create}
            onUpdate={this.update}
            onDelete={this.delete}
            onIndent={this.indent}
            onOutdent={this.indent}
          />
        </div>
        <div
          className="btn-groups"
          onClick={(ev) => this.deactivateModal("myModal", ev)}
        >
          <button className="btn primary-btn" id="addBtn" onClick={this.create}>
            Add New
          </button>
        </div>
        {this.state.showModal && (
          <Modal
            title={this.state.mode === 1 ? "Create Task" : "Rename Task"}
            inputTitle="task name"
            inputPlaceHolder="e.g: Wash Clothes"
            primaryButtonTitle={this.state.mode === 1 ? "Create" : "Rename"}
            transmitData={this.gotData}
            // TODO: add value in updateMode
            value={this.state.mode === 2 ? this.state.tempTitle : ""}
            deactivateModal={this.deactivateModal}
          />
        )}
      </div>
    );
  }
  indent = (data) => {
    this.state.storage.set(data);
    this.setState({
      tasks: data,
    });
  };
  gotData = (childData) => {
    switch (this.state.mode) {
      case 1: {
        let data = [...this.state.tasks];
        let newTask = {
          title: childData,
          timestamp: Date.now(),
          id: this.state.idCounter,
        };
        if (this.state.parentId) {
          // Append
          // Finds the parent and push newTask in it's children array
          for (const v of data) {
            if (v.id === this.state.parentId) {
              v.children.push(newTask);
            }
          }
        } else {
          // Create
          // if its a big Task (Parent Similar), add children to its Object (for later use).
          Object.assign(newTask, { children: [] });
          data.push(newTask);
        }
        this.state.storage.set(data);
        break;
      }
      case 2: {
        // TODO: write update - rename - child indents
        // Update
        // Renaming a task
        let data = [...this.state.tasks];
        for (const v of data) {
          for (const cV of v.children) {
            if (cV.id === this.state.tempId) {
              cV.title = childData;
              break;
            }
          }
          if (v.id === this.state.tempId) {
            v.title = childData;
            break;
          }
        }
        this.state.storage.set(data);
        break;
      }
      default: {
        break;
      }
    }
    this.setState({
      showModal: false,
      mode: 0,
      parentId: null,
      tempId: null,
      tempTitle: null,
    });
  };
}

export default App;
