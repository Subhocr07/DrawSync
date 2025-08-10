import Canvas from '../models/Canvas.js';
import Message from '../models/Message.js';

export async function createCanvas(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const canvas = await Canvas.create({ name, owner: req.userId, participants: [req.userId], strokes: [] });
    res.status(201).json(canvas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function listCanvases(req, res) {
  try {
    // Return all canvases for simplicity so new users can discover and join
    const canvases = await Canvas.find({}).sort({ updatedAt: -1 });
    res.json(canvases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getCanvas(req, res) {
  try {
    const { id } = req.params;
    const canvas = await Canvas.findById(id);
    if (!canvas) return res.status(404).json({ message: 'Not found' });
    res.json(canvas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function saveStrokes(req, res) {
  try {
    const { id } = req.params;
    const { strokes } = req.body;
    const canvas = await Canvas.findById(id);
    if (!canvas) return res.status(404).json({ message: 'Not found' });
    if (!canvas.participants.map(String).includes(String(req.userId)))
      return res.status(403).json({ message: 'Forbidden' });
    canvas.strokes = strokes;
    await canvas.save();
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getMessages(req, res) {
  try {
    const { id } = req.params;
    const messages = await Message.find({ canvas: id }).populate('sender', 'fullName email').sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


