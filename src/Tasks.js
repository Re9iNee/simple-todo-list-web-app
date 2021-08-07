import React from 'react';
import "./styles/Tasks.css";


class Tasks extends React.Component {
    handleKeydown = (event, id, task, index) => {
        // FIXME: optimize (duplicate vars)
        // (onFocus)Enter -> New Task
        // TODO: dblCheck enter KeyCode in windows
        if (event.keyCode === 13) {
            event.preventDefault();
            // open modal in createMode
            this.props.onCreate(event, id);
        }

        if (event.shiftKey) {
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
    }
    handleDblClick = (event, id, title) => {
        event.stopPropagation();
        this.props.onUpdate(event, id, title)
    }

    handleOutdent = (event, child, childIndex, Pindex) => {
        if (event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();

            // removing from children array
            this.props.tasks[Pindex].children.splice(childIndex, 1);
            // adding to tasks
            Object.assign(child, {children: []});
            this.props.tasks.splice(Pindex + 1, 0, child);
            this.props.onOutdent(this.props.tasks)
        }
    }
    render() {
        return (
            <ul>
                {this.props.tasks.map((task, index) => 
                    <li 
                    tabIndex="0"
                    key = { task.id } 
                    onKeyDown = { (ev) => this.handleKeydown(ev, task.id, task, index) }
                    onDoubleClick= { (ev) => this.handleDblClick(ev, task.id, task.title) }>
                        {task.title}
                        {task.children.length > 0 && 
                        <ul>
                            {task.children.map((child, childIndex) => 
                            <li 
                            key={child.id} 
                            onDoubleClick= { (ev) => this.handleDblClick(ev, child.id, child.title) }
                            onKeyDown= { (ev) => this.handleOutdent(ev, child, childIndex, index) }
                            tabIndex="0">{child.title}</li>)}
                        </ul>
                        }
                    </li>
                )}
          </ul>
        );
    }
}
export default Tasks;