// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        minlength: [3, 'Project name must be at least 3 characters'],
        maxlength: [50, 'Project name cannot exceed 50 characters']
    },
    repoUrl: {
        type: String,
        required: [true, 'Repository URL is required'],
        match: [/^https?:\/\/(www\.)?github\.com\/.+\/.+\.git$/, 'Please provide a valid GitHub repository URL ending with .git']
    },
    repoName: {
        type: String,
        required: [true, 'Repository name (user/repo) is required']
    },
    branch: {
        type: String,
        default: 'main'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activeDeploymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deployment',
        default: null
    },
    webhookSecret: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes - Search ko fast banane ke liye
projectSchema.index({ owner: 1, isDeleted: 1 });
// Ek user ek hi repo ko do baar add na kar paye
projectSchema.index({ repoUrl: 1, owner: 1 }, { unique: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;