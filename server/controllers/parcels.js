import { BigQuery } from '@google-cloud/bigquery';
import fs from 'fs';
import Papa from 'papaparse';
import { parse as originalParse } from 'wellknown';
import Parcel from '../models/Parcel.js';

const bigQuery = new BigQuery();

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#F3FF33', '#FF3357'];

export const getParcel = async (req, res) => {
  const { blklot } = req.query;

  try {
    const parcels = await Parcel.find({ blklot: blklot });
    
    if (!parcels) {
      return res.status(404).json({ message: 'No parcels found.' });
    }

    res.status(200).json(parcels);
  } catch (error) {
    return res.json({message: error.message});
  }
};


export const getZoningSims = async (req, res) => {
  const query = `SELECT DISTINCT zoning_sim FROM \`norse-fiber-418004.map.zoning-districts\` ORDER BY zoning_sim`;

  try {
    const [rows] = await bigQuery.query(query);

    const zoningColor = rows.reduce((acc, row, index) => {
      acc[row.zoning_sim] = colors[index % colors.length];
      return acc;
    }, {});

    res.json(zoningColor);
  } catch (error) {
    console.error(`Failed to query BigQuery for unique zoning_sim values: ${error}`);
    res.status(500).json({ error: 'Failed to fetch unique zoning_sim values' });
  }
};

const fsp = fs.promises;
const BATCH_SIZE = 500;

export const parseParcels = async (req, res) => {
  let allData = []; // Use this to collect all parcel data first

  try {
    const csvData = await fsp.readFile('./data/cleaned_parcels.csv', 'utf8');

    // Synchronously collect data
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        if (row.data.active) {
          allData.push(createParcel(row.data));
        } else {
          console.log(`Skipping row with inactive status: ${JSON.stringify(row.data)}`);
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
  const toBoolean = (val) => val === "True";


  return new Parcel({
    mapblklot: data.mapblklot,
    blklot: data.blklot,
    block_num: data.block_num,
    lot_num: data.lot_num,
    from_address_num: data.from_address_num,
    to_address_num: data.to_address_num,
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
    centroid: data.centroid,
    centroid_latitude: data.centroid_latitude,
    centroid_longitude: data.centroid_longitude,
    supervisor_district: data.supervisor_district,
    supervisor_name: data.supervisor_name,
    analysis_neighborhood: data.analysis_neighborhood
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
