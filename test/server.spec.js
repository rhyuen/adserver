const should = require("chai").should();
const chaiHttp = require("chai-http");
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const server = require("../server.js");

chai.use(chaiHttp);
chai.use(chaiAsPromised);


describe("Check Root Server working.", () => {
    it("should return 200", (done) => {
        chai.request(server)
            .get("/")
            .end(async(err, res) => {
                res.status.should.equal(200);
                res.should.be.a("object");
                res.route.should.be.equal("/");                
                done();
            });
    });
});

