const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// module.exports = {getClassifications}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }


/* ***************************
 *  Get inventory item by inventory id
 * ************************** */
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}


/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classificationName) {
  try {
    const result = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id",
      [classificationName]
    )
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error " + error)
  }
}


/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory({ classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color }) {
  try {
    const sql = `INSERT INTO public.inventory 
                 (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("addInventory error " + error);
  }
}


/* ***************************
 *  Delete inventory items by classification ID
 * ************************** */
async function deleteInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    );
    return result;
  } catch (error) {
    console.error("deleteInventoryByClassificationId error " + error);
    throw error;
  }
}

/* ***************************
 *  Delete classification by ID
 * ************************** */
async function deleteClassificationById(classification_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.classification WHERE classification_id = $1",
      [classification_id]
    );
    return result;
  } catch (error) {
    console.error("deleteClassificationById error " + error);
    throw error;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error: " + error);
    throw new Error("Delete Inventory Error");
  }
}




module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory, deleteInventoryByClassificationId, deleteClassificationById, updateInventory, deleteInventoryItem };