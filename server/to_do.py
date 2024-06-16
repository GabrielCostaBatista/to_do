from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.sqlite'
app.config['SQLAlchemy_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    done = db.Column(db.Boolean, default=False)


# Route to get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()  # Query all tasks from the database
    # Return tasks as JSON
    return jsonify([{'id': task.id, 'title': task.title, 'done': task.done} for task in tasks])

# Route to add a new task
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json  # Get JSON data from the request
    new_task = Task(title=data['title'])  # Create a new Task object
    db.session.add(new_task)  # Add the new task to the session
    db.session.commit()  # Commit the session to save changes
    # Return the new task as JSON
    return jsonify({'id': new_task.id, 'title': new_task.title, 'done': new_task.done}), 201

# Route to delete a task by ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)  # Query the task by ID
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    db.session.delete(task)  # Delete the task
    db.session.commit()  # Commit the session to save changes
    return '', 204

# Route to update a task by ID
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json  # Get JSON data from the request
    task = Task.query.get(task_id)  # Query the task by ID
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    task.title = data.get('title', task.title)  # Update task title
    task.done = data.get('done', task.done)  # Update task status
    db.session.commit()  # Commit the session to save changes
    # Return the updated task as JSON
    return jsonify({'id': task.id, 'title': task.title, 'done': task.done})

if __name__ == '__main__':
    app.run(debug=True, port=8080)  # Run the app in debug mode