const express = require("express");
const {uploadVehicle, GetVehicles, checkVehicleAvailability,  statusUpdate, rentalStatusUpdate} = require("../controllers/vehicle.controller") 
const {upload} = require("../utils/multer")
const router = express.Router();

router.post('/rental/uploadvehicle',  upload.single('images'), uploadVehicle);
router.post('/rental/getvehicle' , GetVehicles)
router.get('/vehicle/checkavailability/:id', checkVehicleAvailability);
router.put('/status/:id', statusUpdate);
router.put('/updateStatus/:id/:status', rentalStatusUpdate)
// router.put('/updateStatus/:id/toggle', rentalStatusUpdate)

module.exports = router;