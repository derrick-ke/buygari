const faker = require('faker');

const cars = [
  {
    id: 1,
    manufacturer: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    type: faker.vehicle.type(),
    fuel: faker.vehicle.fuel(),
  },
];

exports.checkID = (req, res, next) => {
  if (req.params.id * 1 > cars.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.model || !req.body.fuel) {
    return res.status(404).json({
      status: 'fail',
      message: 'Bad request',
    });
  }
  next();
};

exports.getAllCars = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      cars,
    },
  });
};

exports.getCar = (req, res) => {
  const id = req.params.id * 1;
  const car = cars.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { car },
  });
};

exports.createCar = (req, res) => {
  console.log(req.body);
  res.send('Done!');
};

exports.updateCar = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'car',
  });
};

exports.deleteCar = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'car',
  });
};
