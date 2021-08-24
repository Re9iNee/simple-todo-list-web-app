import React from "react";
import "./styles/Tasks.css";

class Tasks extends React.Component {
  handleKeydown = (event, id, task, index) => {
    // FIXME: optimize (duplicate vars)

    // Remove A Parent - Semi-Parent (no childs only big Title)
    // on Ctrl+Shift+Delete -> Windows - Removing a Task
    if (event.ctrlKey)
      if (event.shiftKey)
        if (event.keyCode === 8) {
          event.stopPropagation();
          this.props.onDelete(event, id);
        }
    // on Command + Delete -> Mac - Removing a Task
    if (event.metaKey)
      if (event.keyCode === 8) {
        event.stopPropagation();
        this.props.onDelete(event, id);
      }

    // (onFocus)Enter -> New Task
    // TODO: dblCheck enter KeyCode in windows
    if (event.keyCode === 13) {
      event.preventDefault();
      // open modal in createMode
      this.props.onCreate(event, id);
    }

    // (onFocus)Tab -> Indent Outdent Toggle
    if (event.keyCode === 9) {
      event.preventDefault();
      // 0.5: is it the first element in a list? y (do nothing)
      // 1. is this task has children? y (Do nothing)
      // 2. n? (Indent to its parent)
      if (!task.children.length && index !== 0) {
        // INDENT
        // removing children Array from it
        delete task.children;
        // adding to parent
        this.props.tasks[index - 1].children.push(task);
        this.props.tasks.splice(index, 1);
        // UPDATE App Component
        this.props.onIndent(this.props.tasks);
      }
    }
  };
  handleDblClick = (event, id, title) => {
    event.stopPropagation();
    this.props.onUpdate(event, id, title);
  };

  handleChildKeydown = (event, child, childIndex, Pindex) => {
    // Remove A Parent - Semi-Parent (no childs only big Title)
    // on Ctrl+Shift+Delete -> Windows - Removing a Task
    if (event.ctrlKey)
      if (event.shiftKey)
        if (event.keyCode === 8) {
          event.stopPropagation();
          this.props.onDelete(event, child.id);
        }
    // on Command + Delete -> Mac - Removing a Task
    if (event.metaKey)
      if (event.keyCode === 8) {
        event.stopPropagation();
        this.props.onDelete(event, child.id);
      }

    // On Tab Key, Indent Outdent Toggle
    if (event.keyCode === 9) {
      event.preventDefault();
      event.stopPropagation();

      // removing from children array
      this.props.tasks[Pindex].children.splice(childIndex, 1);
      // adding to tasks
      Object.assign(child, { children: [] });
      this.props.tasks.splice(Pindex + 1, 0, child);
      this.props.onOutdent(this.props.tasks);
    }
  };
  render() {
    return (
      <ul>
        {this.props.tasks.map((task, index) => (
          <li
            tabIndex="0"
            key={task.id}
            onKeyDown={(ev) => this.handleKeydown(ev, task.id, task, index)}
            onDoubleClick={(ev) => this.handleDblClick(ev, task.id, task.title)}
            data-test="parent-task"
          >
            {task.title}
            {task.children.length > 0 && (
              <ul>
                {task.children.map((child, childIndex) => (
                  <li
                    data-test="child-task"
                    key={child.id}
                    onDoubleClick={(ev) =>
                      this.handleDblClick(ev, child.id, child.title)
                    }
                    onKeyDown={(ev) =>
                      this.handleChildKeydown(ev, child, childIndex, index)
                    }
                    tabIndex="0"
                  >
                    {child.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }
}
export default Tasks;
