import mongoose from "mongoose";
import { ProjectStatus } from "../configs/ProjectStatus.js";

/* Define nested schemas for detailed project components */
const ObjectiveSchema = new mongoose.Schema({
  description: String,
  isCompleted: { type: Boolean, default: false }
});

const BudgetItemSchema = new mongoose.Schema({
  category: String,
  estimatedCost: Number,
  actualCost: Number
});

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  contactInformation: String
});

const MaterialSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date
});

const PermitSchema = new mongoose.Schema({
  type: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
  issueDate: Date,
  expiryDate: Date
});

const CommunicationPlanSchema = new mongoose.Schema({
  stakeholder: String,
  method: String,
  frequency: String
});

const EngineeringAssessmentSchema = new mongoose.Schema({
  systemType: String,
  condition: String,
  recommendations: String
});

const VisualizationSchema = new mongoose.Schema({
  type: String,
  description: String,
  dateCreated: Date
});

/* Change material to ObjectId instead of String */
const MaterialTakeoffSchema = new mongoose.Schema({
  materialId: String,
  quantityRequired: Number
});

const ConstructionEstimateSchema = new mongoose.Schema({
  category: String,
  estimatedCost: Number
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.ACTIVE
  },
  initialDate: {
    type: Date,
    default: Date.now
  },
  objectives: [ObjectiveSchema],
  budget: {
    total: Number,
    items: [BudgetItemSchema]
  },
  team: [TeamMemberSchema],
  materials: [MaterialSchema],
  permits: [PermitSchema],
  communicationPlan: [CommunicationPlanSchema],
  engineeringAssessments: [EngineeringAssessmentSchema],
  visualizations: [VisualizationSchema],
  materialTakeoffs: [MaterialTakeoffSchema],
  constructionEstimates: [ConstructionEstimateSchema],
  contracts: [{
    type: mongoose.Types.ObjectId,
    ref: 'Contract'
  }],
  completionDate: Date
},
{ timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;