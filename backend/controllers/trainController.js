const Train = require('../models/Train');

exports.createTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json(train);
  } catch (err) {
    res.status(400).json({ message: 'Error creating train', error: err.message });
  }
};

exports.getTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trains' });
  }
};

exports.getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching train' });
  }
};

exports.updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (err) {
    res.status(400).json({ message: 'Error updating train' });
  }
};

exports.deleteTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json({ message: 'Train deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting train' });
  }
}; 