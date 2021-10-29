const jwt = require('jsonwebtoken');
const express = require('express')
const moment = require('moment');
const { Base64 } = require('js-base64');

const Report = require('../data/report_Schema');

const Mongoose = require('mongoose');

const router = express.Router();

module.exports = (secret_key) => {

    //신고등록
    router.post('/report', (req, res) => {
        const data = req.body;

        Report.findOne({ board_id: req.body.board_id, report_user: req.body.report_user },
            async (err, reports) => {
                if (err) {
                    console.log("report Error : ", err);
                    res.json({ report_insert: -1 });
                    return;
                }
                else {
                    if (reports) {
                        res.json({ report_insert: 0 });
                        return;
                    }
                    else {
                        const newReport = new Report();

                        newReport.board_id = req.body.board_id;
                        newReport.report_user = req.body.report_user;
                        newReport.bad_user = req.body.bad_user;
                        newReport.report_type = req.body.report_form_data.selected_value;
                        newReport.report_content = req.body.report_form_data.content;

                        await newReport.save((err) => {
                            if (err) {
                                console.log(err);
                                res.json({ report_insert: -1 });
                                return;
                            }
                            else {
                                res.json({ report_insert: 1 });
                            }
                        })
                    }
                }
            })
    })

    //신고조회
    router.post('/search', (req, res) => {
        const data = req.body;

        Report.findOne({ board_id: req.body.board_id, report_user: req.body.report_user },
            (err, reports) => {
                if (err) {
                    console.log(err);
                    res.json({ report_search: -1 });
                    return;
                }
                else {
                    if (reports) {
                        res.json({ report_search: 1, data: reports });
                        return;
                    }
                    else {
                        res.json({ report_search: 0 });
                    }
                }
            })
    })

    return router;
}