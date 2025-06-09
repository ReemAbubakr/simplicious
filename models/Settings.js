const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  title: { type: String, default: 'My Cooking Recipes' },
  email: { type: String, default: 'admin@example.com' },
  themeColor: { type: String, default: '#ff6600' },
  logo: { type: String, default: '/images/panlog.png' }
});

module.exports = mongoose.model('Settings', SettingsSchema);