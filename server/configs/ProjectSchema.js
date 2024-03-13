import mongoose from "mongoose";

export const PropertyIdentificationSchema = new mongoose.Schema({
  siteAddress: { type: String },
  assessorParcelNo: { type: String },
  zipCode: { type: String }
});

export const ZoningAndLandUseSchema = new mongoose.Schema({
  zoning: { type: String },
  generalPlanLandUse: { type: String },
  urbanAgricultureIncentiveZone: { type: Boolean, default: false },
  transitOrientedCommunitiesTier: { type: Number },
  specialLandUseZoning: { type: String }
});

export const RegulatoryComplianceAndEligibilitySchema = new mongoose.Schema({
  parkZone500Ft: { type: Boolean, default: false },
  schoolZone500Ft: { type: Boolean, default: false },
  tenantProtectionActAB1482: { type: Boolean, default: false },
  AB2011Eligibility: { type: String },
  reducedParkingAreasAB2097: { type: Boolean, default: false },
  veryLowVMTAB2334: { type: Boolean, default: false },
  rentStabilizationOrdinance: { type: Boolean, default: false },
  ellisActProperty: { type: Boolean, default: false },
  hazardousWasteBorderZoneProperties: { type: Boolean, default: false }
});

export const EnvironmentalAndGeologicalSchema = new mongoose.Schema({
  floodZone: { type: String },
  alquistPrioloFaultZone: { type: Boolean, default: false },
  methaneHazardSite: { type: String },
  liquefaction: { type: Boolean, default: false },
  landslide: { type: Boolean, default: false },
  veryHighFireHazardSeverityZone: { type: Boolean, default: false },
  tsunamiInundationZone: { type: Boolean, default: false }
});

export const DevelopmentConstraintsSchema = new mongoose.Schema({
  airportHazard: { type: String },
  fireDistrictNo1: { type: Boolean, default: false },
  highWindVelocityAreas: { type: Boolean, default: false },
  hillsideAreaZoningCode: { type: Boolean, default: false },
  specialGradingArea: { type: Boolean, default: false }
});

export const BuildingAndConstructionSchema = new mongoose.Schema({
  adaptiveReuseIncentiveArea: { type: String },
  administrativeReview: { type: String },
  buildingLine: { type: Number },
  buildingPermitInfo: { type: String }
});

export const IncentivesAndOpportunitiesSchema = new mongoose.Schema({
  reducedParkingAreasAB2097: { type: Boolean, default: false },
  urbanAgricultureIncentiveZone: { type: Boolean, default: false },
  transitOrientedCommunitiesTier: { type: Number }
});

export const CommunityAndPlanningSchema = new mongoose.Schema({
  communityPlanArea: { type: String },
  neighborhoodCouncil: { type: String },
  councilDistrict: { type: String },
  areaPlanningCommission: { type: String }
});

export const ValuationAndTaxationSchema = new mongoose.Schema({
  assessedImprovementVal: { type: Number },
  assessedLandVal: { type: Number },
  taxRateArea: { type: String }
});

export const AdditionalInformationSchema = new mongoose.Schema({
  lastOwnerChange: { type: Date },
  lastSaleAmount: { type: Number },
  inquiriesDirectedTo: { type: String },
  website: { type: String }
});