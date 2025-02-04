const { log } = require("console");
const { Vehicle } = require("../models/vehicle.model");
const path = require("path");

// upload Vehicle
const uploadVehicle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Bad Request: Image file is required.");
    }
    req.file.path = path.join("uploads", req.file.filename); 

    console.log(req.body, req.file);
    const imageUrl = `${process.env.BACKEND_URL}/${req.file.path}`; 

    const NewVehicle = await Vehicle.create({
      carBrand: req.body.carBrand,
      carModel: req.body.carModel,
      noOfSeats: req.body.noOfSeats,
      rentPerDay: req.body.rentPerDay,
      carlocation: req.body.carLocation,
      licensePlate: req.body.licensePlate,
      avatar: imageUrl,
      address: req.body.address,
      rentalId: req.body.rentalId,
      transmission: req.body.transmission,
      status: "active",
    });

    res.status(200).json({ NewVehicle });
  } catch (error) {
    console.error("Error during uploading vehicle", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// get Vehicle
const GetVehicles = async (req, res) => {
  try {
    let vehicles;
    const vehicleId = req.body.vehicleId;
    if (vehicleId) {
      vehicles = await Vehicle.findById(vehicleId);
      if (!vehicles) {
        return res.status(404).send("Vehicle not found.");
      }
    } else if (req.body.rentalId) {
      vehicles = await Vehicle.find({ rentalId: req.body.rentalId });
    } else if (req.body.customerId) {
      vehicles = await Vehicle.find({ customerId: req.body.customerId });
    } else if (req.body.all) {
      vehicles = await Vehicle.find({ status: { $ne: "disable" } });
    }

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error in GetVehicles:", error.message);
    res.status(500).send("Internal Server Error.");
  }
};

// check vehicle availability
const checkVehicleAvailability = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    const isBooked = await Booking.find({
      vehicleId: vehicleId,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } },
      ],
    });

    if (isBooked.length > 0) {
      return res.status(200).json({
        available: false,
        message: "Vehicle is not available for the selected dates.",
      });
    } else {
      return res.status(200).json({
        available: true,
        message: "Vehicle is available for the selected dates.",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error.");
  }
};

// vehicle Not Available
const statusUpdate = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const item = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { $set: { status: "disable" } },
      { new: true }
    );

    if (item) {
      res.status(200).json({ item });
    } else {
      res.status(404).send("This vehicle is not available.");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error.");
  }
};

// remove vehicle
const removeVehicle = async (req, res) => {
  try {
    const remove = await Vehicle.findByIdAndUpdate(req.params.id);
    if (!remove) {
      res
        .status(404)
        .json({ message: "vehicle not removed, try with your own id" });
    }
    res.status(200).json({ message: "vehicle removed successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error.");
  }
};

// Rental updates vehicle status
const rentalStatusUpdate = async (req, res) => {
//   try {
//     const vehicleId = req.params.id;
//     const status = req.params.status;
//     const item = await Vehicle.findByIdAndUpdate(
//       vehicleId,
//       { $set: { status: status == "active" ? "inactive" : "active" } },
//       { new: true }
//     );

//     if (item) {
//       res.status(200).json({ item });
//     } else {
//       res.status(404).send("This vehicle is not available.");
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error.");
//   }
// };

try {
  const vehicleId = req.params.id;
  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return res.status(404).send("Vehicle not found");
  }

  // Toggle the status
  vehicle.status = vehicle.status === "active" ? "inactive" : "active";
  await vehicle.save();

  res.status(200).json({ item: vehicle });
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
};


module.exports = {
  uploadVehicle,
  GetVehicles,
  checkVehicleAvailability,
  removeVehicle,
  statusUpdate,
  rentalStatusUpdate,
};
