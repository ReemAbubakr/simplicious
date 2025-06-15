const Settings = require('../models/Settings');

exports.getSettingsPage = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    res.render('pages/Settings', { settings });
  } catch (error) {
    console.error('Error loading settings:', error);
    res.status(500).send('Server Error');
  }
};

exports.saveSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
    }

    settings.title = req.body.title || settings.title;
    settings.email = req.body.email || settings.email;
    settings.themeColor = req.body.themeColor || settings.themeColor;
    if (req.file) {
      settings.logo = '/uploads/' + req.file.filename;
    }

    await settings.save();
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
};