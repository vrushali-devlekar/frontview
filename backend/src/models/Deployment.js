// models/Deployment.js
const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['queued', 'building', 'running', 'failed', 'stopped'],
        default: 'queued'
    },
    commitHash: { type: String },
    branch: { type: String, required: true },
    port: {
        type: Number,
        min: 3100,
        max: 4000
    },
    containerId: { type: String },
    buildDuration: { type: Number }, // in milliseconds
    errorMessage: { type: String },
    logs: [{ type: String }],
    triggeredBy: {
        type: String,
        enum: ['manual', 'webhook'],
        default: 'manual'
    },
    startedAt: { type: Date },
    completedAt: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Virtuals ko JSON mein allow karne ke liye
    toObject: { virtuals: true }
});

// Virtual Property for URL
deploymentSchema.virtual('url').get(function() {
    if (this.port) {
        return `http://localhost:${this.port}`;
    }
    return null;
});

// Indexes
deploymentSchema.index({ projectId: 1, version: -1 });
deploymentSchema.index({ projectId: 1, status: 1 });
deploymentSchema.index({ userId: 1, status: 1 });

// Pre-save hook for auto-incrementing version
deploymentSchema.pre('save', async function(next) {
    // Agar naya deployment ban raha hai tabhi version badhao
    if (this.isNew) {
        const lastDeployment = await this.constructor.findOne({ projectId: this.projectId })
            .sort({ version: -1 });
        
        if (lastDeployment) {
            this.version = lastDeployment.version + 1;
        }
    }
    next();
});

const Deployment = mongoose.model('Deployment', deploymentSchema);
module.exports = Deployment;