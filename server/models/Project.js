import mongoose from "mongoose";
import { ProjectStatus } from "../configs/ProjectStatus.js";
import { 
  PropertyIdentificationSchema,
  ZoningAndLandUseSchema,
  RegulatoryComplianceAndEligibilitySchema,
  EnvironmentalAndGeologicalSchema,
  DevelopmentConstraintsSchema,
  BuildingAndConstructionSchema,
  IncentivesAndOpportunitiesSchema,
  CommunityAndPlanningSchema,
  ValuationAndTaxationSchema,
  AdditionalInformationSchema
} from "../configs/ProjectSchema.js";

const ZoningSchema = new mongoose.Schema({
  propertyIdentification: PropertyIdentificationSchema,
  zoningAndLandUse: ZoningAndLandUseSchema,
  regulatoryComplianceAndEligibility: RegulatoryComplianceAndEligibilitySchema,
  environmentalAndGeological: EnvironmentalAndGeologicalSchema,
  developmentConstraints: DevelopmentConstraintsSchema,
  buildingAndConstruction: BuildingAndConstructionSchema,
  incentivesAndOpportunities: IncentivesAndOpportunitiesSchema,
  communityAndPlanning: CommunityAndPlanningSchema,
  valuationAndTaxation: ValuationAndTaxationSchema,
  additionalInformation: AdditionalInformationSchema,
});

const ProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus[0]
    },
    initialDate: {
      type: Date,
      default: Date.now
    },
    crews: [{
      type: mongoose.Types.ObjectId,
      ref: 'Crew'
    }],
    contracts: [{
      type: mongoose.Types.ObjectId,
      ref: 'Contract'
    }],
    zoning: ZoningSchema,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;