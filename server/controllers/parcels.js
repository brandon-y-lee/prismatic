import { BigQuery } from '@google-cloud/bigquery';
import fs from 'fs';
import Papa from 'papaparse';
import { parse as originalParse } from 'wellknown';
import Parcel from '../models/Parcel.js';
import Building from '../models/Building.js';

const bigQuery = new BigQuery();

export const getParcel = async (req, res) => {
  const { blklot } = req.query;

  try {
    const pipeline = [
      {
        $match: { blklot: blklot }
      },
      {
        $lookup: {
          from: "buildings",
          localField: "buildings",
          foreignField: "sf16_bldgid",
          as: "buildingDetails"
        }
      },
    ];

    const parcelsWithBuildings = await Parcel.aggregate(pipeline);
    
    if (!parcelsWithBuildings.length) {
      return res.status(404).json({ message: 'No parcels found.' });
    }

    res.status(200).json(parcelsWithBuildings);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

const fsp = fs.promises;
const BATCH_SIZE = 10000;

export const parseParcels = async (req, res) => {
  let allData = []; // Use this to collect all parcel data first

  try {
    const csvData = await fsp.readFile('./data/joined_parcels_buildings.csv', 'utf8');

    Papa.parse(csvData, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      step: (row) => {
        if (row.data.blklot) {
          allData.push(createParcel(row.data));
        } else {
          console.log(`Skipping row with no blklot: ${JSON.stringify(row.data)}`);
        }
      },
      complete: async () => {
        // Now, process allData in batches after parsing is complete
        try {
          for (let i = 0; i < allData.length; i += BATCH_SIZE) {
            const batch = allData.slice(i, i + BATCH_SIZE);
            await saveBatch(batch);
          }
          res.status(200).json({ message: `${allData.length} parcels parsed and saved successfully.` });
        } catch (error) {
          console.error('Batch processing error:', error);
          res.status(400).json({ message: error.message });
        }
      },
      error: (error) => {
        console.error('Parsing error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    res.status(500).json({ message: error.message });
  }
};


function createParcel(data) {
  const toBoolean = (val) => val === 'true';

  const toNumber = (val) => {
    const parsed = Number(val);
    return isNaN(parsed) ? null : parsed;
  };

  const buildingIds = data.buildings ? data.buildings.split(',').map(id => id.trim()) : [];

  return new Parcel({
    mapblklot: data.mapblklot,
    blklot: data.blklot,
    block_num: data.block_num,
    lot_num: data.lot_num,
    from_address_num: toNumber(data.from_address_num),
    to_address_num: toNumber(data.to_address_num),
    street_name: data.street_name,
    street_type: data.street_type,
    in_asr_secured_roll: toBoolean(data.in_asr_secured_roll),
    pw_recorded_map: toBoolean(data.pw_recorded_map),
    zoning_code: data.zoning_code,
    zoning_district: data.zoning_district,
    date_rec_add: data.date_rec_add,
    date_rec_drop: data.date_rec_drop,
    date_map_add: data.date_map_add,
    date_map_drop: data.date_map_drop,
    active: toBoolean(data.active),
    shape: data.shape,
    centroid_latitude: toNumber(data.centroid_latitude),
    centroid_longitude: toNumber(data.centroid_longitude),
    supervisor_district: toNumber(data.supervisor_district),
    supervisor_name: data.supname,
    analysis_neighborhood: data.analysis_neighborhood,
    bldgsqft: toNumber(data.bldgsqft),
    cie: toNumber(data.cie),
    landuse: data.landuse,
    landval: toNumber(data.landval),
    med: toNumber(data.med),
    mips: toNumber(data.mips),
    mixed_use: data.mixed_use,
    pdr: toNumber(data.pdr),
    restype: data.restype,
    resunits: toNumber(data.resunits),
    retail: toNumber(data.retail),
    st_area_sh: toNumber(data.st_area_sh),
    st_length: toNumber(data.st_length),
    strucval: toNumber(data.strucval),
    usetype: data.usetype,
    visitor: toNumber(data.visitor),
    yrbuilt: toNumber(data.yrbuilt),
    buildings: buildingIds,
  });
}

async function saveBatch(batch) {
  return Parcel.insertMany(batch);
}


export const parseLandUse = async (req, res) => {
  try {
    const csvData = await fsp.readFile('./data/cleaned_land_use.csv', 'utf8');
    let updateOperations = [];

    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        const updateOperation = prepareUpdateOperation(row.data);
        if (updateOperation) updateOperations.push(updateOperation);
      },
      complete: () => executeBatchUpdates(updateOperations, res),
      error: (error) => {
        console.error('Parsing error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    res.status(500).json({ message: error.message });
  }
};

function prepareUpdateOperation(data) {
  if (!data.blklot) {
    console.log(`Skipping row with no blklot: ${JSON.stringify(data)}`);
    return null;
  }
  const updateObject = {...data};
  delete updateObject.blklot;

  return {
    filter: { blklot: data.blklot },
    update: { $set: updateObject }
  };
}

async function executeBatchUpdates(updateOperations, res) {
  try {
    for (let i = 0; i < updateOperations.length; i += BATCH_SIZE) {
      const batch = updateOperations.slice(i, i + BATCH_SIZE).map(op => Parcel.updateOne(op.filter, op.update));
      await Promise.all(batch);
    }
    res.status(200).json({ message: `${updateOperations.length} parcels updated successfully.` });
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(400).json({ message: error.message });
  }
}



export const parseBuildings = async (req, res) => {
  let allData = []; // Use this to collect all parcel data first

  try {
    const csvData = await fsp.readFile('./data/calculated_building_footprints.csv', 'utf8');

    // Synchronously collect data
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      step: (row) => {
        if (row.data.mapblklot) {
          allData.push(createBuilding(row.data));
        } else {
          console.log(`Skipping row with no mapblklot: ${JSON.stringify(row.data)}`);
        }
      },
      complete: async () => {
        // Now, process allData in batches after parsing is complete
        try {
          for (let i = 0; i < allData.length; i += BATCH_SIZE) {
            const batch = allData.slice(i, i + BATCH_SIZE);
            await saveBuildingBatch(batch);
          }
          res.status(200).json({ message: `${allData.length} parcels parsed and saved successfully.` });
        } catch (error) {
          console.error('Batch processing error:', error);
          res.status(400).json({ message: error.message });
        }
      },
      error: (error) => {
        console.error('Parsing error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    res.status(500).json({ message: error.message });
  }
};

function createBuilding(data) {
  // Helper function to convert string values to boolean
  const toBoolean = (val) => val === 'true'; // Assuming the CSV has 'true'/'false' as boolean strings

  // Helper function to safely convert strings to numbers
  const toNumber = (val) => {
    const parsed = Number(val);
    return isNaN(parsed) ? null : parsed; // or return null if you want to preserve non-numeric as null
  };

  return new Building({
    sf16_bldgid: data.sf16_bldgid,
    area_id: data.area_id,
    mapblklot: data.mapblklot,
    area: toNumber(data.area),
    perimeter: toNumber(data.perimeter),
    shape: data.shape,
    data_as_of: data.data_as_of,
    data_loaded_at: data.data_loaded_at,
  });
}


async function saveBuildingBatch(batch) {
  return Building.insertMany(batch);
}