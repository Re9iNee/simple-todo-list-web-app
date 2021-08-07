import React from 'react';
import "./styles/Tasks.css";


class Tasks extends React.Component {
    render() {
        return (
            <ul>
                {this.props.tasks.map((task) => 
                    <li tabIndex="0" key={task.id}>
                        {task.title}
                        {task.children.length > 0 && 
                        <ul>
                            {task.children.map((child) => 
                            <li key={child.id} tabIndex="0">{child.title}</li>)}
                        </ul>
                        }
                    </li>
                )}
          </ul>
        );
    }
}
export default Tasks;