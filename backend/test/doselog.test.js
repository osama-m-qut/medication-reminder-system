// Unit tests for dose-log adherence logic.
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const DoseLog = require('../models/DoseLog');
const { getAdherence } = require('../controllers/doseLogController');

const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('DoseLog Controller — adherence', () => {
    afterEach(() => sinon.restore());

    it('computes adherence as taken / (taken + skipped + missed)', async () => {
        const req = { user: { _id: 'u1', id: 'u1' } };
        const res = mockRes();
        sinon.stub(DoseLog, 'aggregate').resolves([
            { _id: 'taken', count: 8 },
            { _id: 'skipped', count: 1 },
            { _id: 'missed', count: 1 },
        ]);

        await getAdherence(req, res);

        const body = res.json.firstCall.args[0];
        expect(body.adherence).to.equal(80); // 8 / 10 = 80%
        expect(body.taken).to.equal(8);
    });

    it('returns 0% adherence when there are no accountable doses', async () => {
        const req = { user: { _id: 'u1', id: 'u1' } };
        const res = mockRes();
        sinon.stub(DoseLog, 'aggregate').resolves([]);

        await getAdherence(req, res);

        expect(res.json.firstCall.args[0].adherence).to.equal(0);
    });
});
