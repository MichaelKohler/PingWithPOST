/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Author: Michael Kohler <mkohler@picobudget.com>
 * Contributors:
 *   - yournamehere <mail@mail.ch>
 */

'use strict';
var request = require('../models/request.js');

// render the main page
exports.main = function (req, res) {
    var locals = {};
    locals.interval = req.params.interval || 60; // 60 seconds default interval
    request.getLastRequestDate(locals.interval, function(lastRequestDate) {
        locals.lastRequestDate = lastRequestDate;
        request.getStatus(locals.lastRequestDate, locals.interval, function(status) {
            locals.status = status;
            res.render('index', locals);
        });
    });
};

// POST request to /ping to update the last request time
exports.ping = function (req, res) {
    request.add(function () {
        res.end();
    });
};

// used to get the status via AJAX
exports.getStatus = function(req, res) {
    var response = {};
    var interval = req.params.interval || 60; // 60 seconds default interval

    request.getLastRequestDate(interval, function(lastRequestDate) {
        response.lastRequestDate = lastRequestDate;
        request.getStatus(response.lastRequestDate, interval, function(status) {
            response.status = status;
            res.json(JSON.stringify(response));
            console.log("Status was requested: " + JSON.stringify(response));
            res.end();
        });
    });
};

// init the DB
exports.initDB = function(req, res) {
    request.initDB(function () {
        res.json("{ \"text\": \"DB initialisiert.\"");
        console.log("DB initialisiert.");
        res.end();
    });
};