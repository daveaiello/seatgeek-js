var expect = require("chai").expect;
var seatgeek = require("../SeatGeek");
var rewire = require('rewire');
var apiKey = require('./config.json').API_KEY;

var should = require('chai').should();
var assert = require('chai').assert;

var _seatgeekRewired = rewire('../SeatGeek');

describe("SeatGeek object", function () {
    var _seatgeek;
    
    describe("Passing an api key into constructor should create an instance of SeatGeek", function () {
        _seatgeek = new seatgeek(apiKey);
        it('should be defined', function () {
            _seatgeek.should.be.a('object');
        });

        it('should throw an error with no API key', function () {
            expect(function () { new seatgeek() }).to.throw('API Key required');
        });
    });
});

describe("Events", function () {
    var _seatgeek;

    beforeEach(function () {
         _seatgeek = new _seatgeekRewired(apiKey);
    })
    describe("allEvents", function () {

        it('should set the requestUrl correctly', function () {
            _seatgeek.Event.allEvents();
            expect(_seatgeek.Event.requestUrl)
            .to
            .equal('https://api.seatgeek.com/2/events?client_id='+ apiKey);
            
        });
    });

    describe("eventById", function () {
        it('should set the requestUrl correctly', function () {
            _seatgeek.Event.eventById('1');
            expect(_seatgeek.Event.requestUrl)
            .to
            .equal('https://api.seatgeek.com/2/events/1?client_id='+ apiKey);
        });
    });
});

describe("Result Manipulation", function () {
    var _seatgeek;

    beforeEach(function () {
         _seatgeek = new seatgeek(apiKey);
    })
    describe("per_page", function () {
        it('should set the requestUrl correctly', function () {
            _seatgeek.Event.allEvents().perPage(10);
            expect(_seatgeek.Event.requestUrl)
            .to
            .equal('https://api.seatgeek.com/2/events?client_id='+ apiKey + '&per_page=10');
        });

        it('should limit the API results', function (done) {
            return _seatgeek.Event.allEvents().perPage(5).get().then(function(res){
                res = JSON.parse(res);
                expect(res.meta.per_page).to.equal(5);
                expect(res.events.length).to.equal(5);
                done();
            });
        });
    });

    describe("page", function () {
        it('should set the requestUrl correctly', function () {
            _seatgeek.Event.allEvents().page(22);
            expect(_seatgeek.Event.requestUrl)
            .to
            .equal('https://api.seatgeek.com/2/events?client_id='+ apiKey + '&page=22');
        });

        it('should retrieve the correct page number', function (done) {
            return _seatgeek.Event.allEvents().page(22).get().then(function(res){
                res = JSON.parse(res);
                expect(res.meta.page).to.equal(22);
                done();
            });
        });
    });
});