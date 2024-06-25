const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please enter a task.']
    },
    description:{
        type: String,
        default: 'No description provided.'
    },
    completed:{
        type: Boolean,
        default: false,
        required: true
    },
    dueDate: {
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},
{
    timestamps: true,
    collection: "todos",
})

module.exports = mongoose.model('Task', taskSchema);