export function stringAvatar(name) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return {
    sx: { bgcolor: color },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(date);
};

export const transformData = (data) => {
  const normalizeKey = (key) => key.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const normalizedData = Object.keys(data).reduce((acc, key) => {
    acc[normalizeKey(key)] = data[key];
    return acc;
  }, {});

  const getValue = (normalizedKey, defaultValue = undefined) => {
    return normalizedData[normalizedKey] || defaultValue;
  };

  const toBoolean = (value) => value === 'Yes';

  return {
    propertyIdentification: {
      siteAddress: getValue(normalizeKey('Site Address')),
      assessorParcelNumber: getValue(normalizeKey('Assessor Parcel No. (APN)')),
      zipCode: getValue(normalizeKey('ZIP Code'))
    },
    zoningAndLandUse: {
      zoning: getValue(normalizeKey('Zoning')),
      generalPlanLandUse: getValue(normalizeKey('General Plan Land Use')),
      urbanAgricultureIncentiveZone: getValue(normalizeKey('Urban Agriculture Incentive Zone')) === 'YES',
      transitOrientedCommunitiesTier: parseInt(getValue(normalizeKey('Transit Oriented Communities (TOC)')).replace('Tier ', ''), 10),
      specialLandUseZoning: getValue(normalizeKey('Special Land Use / Zoning'))
    },
    regulatoryComplianceAndEligibility: {
      parkZone500Ft: toBoolean(getValue(normalizeKey('500 Ft Park Zone'))),
      schoolZone500Ft: toBoolean(getValue(normalizeKey('500 Ft School Zone'))),
      tenantProtectionActAB1482: toBoolean(getValue(normalizeKey('AB 1482: Tenant Protection Act'))),
      AB2011Eligibility: getValue(normalizeKey('AB 2011 Eligibility')),
      reducedParkingAreasAB2097: toBoolean(getValue(normalizeKey('AB 2097: Reduced Parking Areas'))),
      veryLowVMTAB2334: toBoolean(getValue(normalizeKey('AB 2334: Very Low VMT'))),
      rentStabilizationOrdinance: getValue(normalizeKey('Rent Stabilization Ordinance (RSO)')).startsWith('Yes'),
      ellisActProperty: toBoolean(getValue(normalizeKey('Ellis Act Property'))),
      hazardousWasteBorderZoneProperties: toBoolean(getValue(normalizeKey('Hazardous Waste / Border Zone Properties')))
    },
    environmentalAndGeological: {
      floodZone: getValue(normalizeKey('Flood Zone')),
      alquistPrioloFaultZone: toBoolean(getValue(normalizeKey('Alquist-Priolo Fault Zone'))),
      methaneHazardSite: getValue(normalizeKey('Methane Hazard Site')),
      liquefaction: toBoolean(getValue(normalizeKey('Liquefaction'))),
      landslide: toBoolean(getValue(normalizeKey('Landslide'))),
      veryHighFireHazardSeverityZone: toBoolean(getValue(normalizeKey('Very High Fire Hazard Severity Zone'))),
      tsunamiInundationZone: toBoolean(getValue(normalizeKey('Tsunami Inundation Zone')))
    },
    developmentConstraints: {
      airportHazard: getValue(normalizeKey('Airport Hazard')),
      fireDistrictNo1: toBoolean(getValue(normalizeKey('Fire District No. 1'))),
      highWindVelocityAreas: toBoolean(getValue(normalizeKey('High Wind Velocity Areas'))),
      hillsideAreaZoningCode: toBoolean(getValue(normalizeKey('Hillside Area (Zoning Code)'))),
      specialGradingArea: toBoolean(getValue(normalizeKey('Special Grading Area (BOE Basic Grid Map A-13372)')))
    },
    buildingAndConstruction: {
      adaptiveReuseIncentiveArea: getValue(normalizeKey('Adaptive Reuse Incentive Area')),
      administrativeReview: getValue(normalizeKey('Administrative Review')),
      buildingLine: parseInt(getValue(normalizeKey('Building Line'))),
      buildingPermitInfo: getValue(normalizeKey('Building Permit Info'))
    },
    incentivesAndOpportunities: {
      reducedParkingAreasAB2097: toBoolean(getValue(normalizeKey('AB 2097: Reduced Parking Areas'))),
      urbanAgricultureIncentiveZone: toBoolean(getValue(normalizeKey('Urban Agriculture Incentive Zone'))),
      transitOrientedCommunitiesTier: parseInt(getValue(normalizeKey('Transit Oriented Communities (TOC)').replace('Tier ', '')))
    },
    communityAndPlanning: {
      communityPlanArea: getValue(normalizeKey('Community Plan Area')),
      neighborhoodCouncil: getValue(normalizeKey('Neighborhood Council')),
      councilDistrict: getValue(normalizeKey('Council District')),
      areaPlanningCommission: getValue(normalizeKey('Area Planning Commission'))
    },
    valuationAndTaxation: {
      assessedImprovementVal: parseFloat(getValue(normalizeKey('Assessed Improvement Val.'))),
      assessedLandVal: parseFloat(getValue(normalizeKey('Assessed Land Val.'))),
      taxRateArea: getValue(normalizeKey('Tax Rate Area'))
    },
    additionalInformation: {
      lastOwnerChange: getValue(normalizeKey('Last Owner Change')),
      lastSaleAmount: parseFloat(getValue(normalizeKey('Last Sale Amount'))),
      inquiriesDirectedTo: getValue(normalizeKey('Direct all Inquiries to')),
      website: getValue(normalizeKey('Website'))
    }
  };
};

const keyMap = {
  propertyIdentification: {
    siteAddress: 'Site Address',
    assessorParcelNumber: 'Assessor Parcel No. (APN)',
    zipCode: 'ZIP Code'
  },
  zoningAndLandUse: {
    zoning: 'Zoning',
    generalPlanLandUse: 'General Plan Land Use',
    urbanAgricultureIncentiveZone: 'Urban Agriculture Incentive Zone',
    transitOrientedCommunitiesTier: 'Transit Oriented Communities (TOC)',
    specialLandUseZoning: 'Special Land Use / Zoning'
  },
  regulatoryComplianceAndEligibility: {
    parkZone500Ft: '500 Ft Park Zone',
    schoolZone500Ft: '500 Ft School Zone',
    tenantProtectionActAB1482: 'AB 1482: Tenant Protection Act',
    AB2011Eligibility: 'AB 2011 Eligibility',
    reducedParkingAreasAB2097: 'AB 2097: Reduced Parking Areas',
    veryLowVMTAB2334: 'AB 2334: Very Low VMT',
    rentStabilizationOrdinance: 'Rent Stabilization Ordinance (RSO)',
    ellisActProperty: 'Ellis Act Property',
    hazardousWasteBorderZoneProperties: 'Hazardous Waste / Border Zone Properties'
  },
  environmentalAndGeological: {
    floodZone: 'Flood Zone',
    alquistPrioloFaultZone: 'Alquist-Priolo Fault Zone',
    methaneHazardSite: 'Methane Hazard Site',
    liquefaction: 'Liquefaction',
    landslide: 'Landslide',
    veryHighFireHazardSeverityZone: 'Very High Fire Hazard Severity Zone',
    tsunamiInundationZone: 'Tsunami Inundation Zone'
  },
  developmentConstraints: {
    airportHazard: 'Airport Hazard',
    fireDistrictNo1: 'Fire District No. 1',
    highWindVelocityAreas: 'High Wind Velocity Areas',
    hillsideAreaZoningCode: 'Hillside Area (Zoning Code)',
    specialGradingArea: 'Special Grading Area (BOE Basic Grid Map A-13372)'
  },
  buildingAndConstruction: {
    adaptiveReuseIncentiveArea: 'Adaptive Reuse Incentive Area',
    administrativeReview: 'Administrative Review',
    buildingLine: 'Building Line',
    buildingPermitInfo: 'Building Permit Info'
  },
  incentivesAndOpportunities: {
    reducedParkingAreasAB2097: 'AB 2097: Reduced Parking Areas',
    urbanAgricultureIncentiveZone: 'Urban Agriculture Incentive Zone',
    transitOrientedCommunitiesTier: 'Transit Oriented Communities (TOC)'
  },
  communityAndPlanning: {
    communityPlanArea: 'Community Plan Area',
    neighborhoodCouncil: 'Neighborhood Council',
    councilDistrict: 'Council District',
    areaPlanningCommission: 'Area Planning Commission'
  },
  valuationAndTaxation: {
    assessedImprovementVal: 'Assessed Improvement Val.',
    assessedLandVal: 'Assessed Land Val.',
    taxRateArea: 'Tax Rate Area'
  },
  additionalInformation: {
    lastOwnerChange: 'Last Owner Change',
    lastSaleAmount: 'Last Sale Amount',
    inquiriesDirectedTo: 'Direct all Inquiries to',
    website: 'Website'
  }
};

const toTitleCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  const title = result.charAt(0).toUpperCase() + result.slice(1);
  return title.trim().replace(/ +/g, ' ');
};

export const invertKey = (inputKey, isSchema = false) => {
  if (isSchema) {
    // Convert schema names directly to a title format
    return toTitleCase(inputKey);
  } else {
    for (const section in keyMap) {
      for (const key in keyMap[section]) {
        if (key === inputKey) {
          return keyMap[section][key];
        }
      }
    }
  }
  return `Key not found: ${inputKey}`;
};