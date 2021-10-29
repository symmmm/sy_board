const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  board_id: String,
  report_user: String,
  bad_user: String,
  report_type: String,
  report_content: String, 
});

module.exports = mongoose.model('report', reportSchema);