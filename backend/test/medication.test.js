// Unit tests for the medication controller.
// Mongoose model methods are stubbed with Sinon so these run with NO database,
// which is what the GitHub Actions runner needs (MongoDB only exists on EC2).
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const Medication = require('../models/Medication');
const {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication,
} = require('../controllers/medicationController');

// Build a fake Express res whose .status() is chainable and whose .json() captures the body.
const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('Medication Controller', () => {
    afterEach(() => sinon.restore());

    describe('createMedication', () => {
        it('creates a medication and returns 201', async () => {
            const req = { user: { id: 'u1' }, body: { name: 'Metformin', dosage: '500 mg' } };
            const res = mockRes();
            sinon.stub(Medication, 'create').resolves({ _id: 'm1', name: 'Metformin' });

            await createMedication(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('name', 'Metformin');
        });

        it('returns 400 when required fields are missing', async () => {
            const req = { user: { id: 'u1' }, body: { name: '' } };
            const res = mockRes();

            await createMedication(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });

    describe('getMedications', () => {
        it('returns the user\'s medications', async () => {
            const req = { user: { id: 'u1' } };
            const res = mockRes();
            sinon.stub(Medication, 'find').returns({ sort: sinon.stub().resolves([{ name: 'A' }]) });

            await getMedications(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.firstCall.args[0]).to.be.an('array').with.length(1);
        });
    });

    describe('updateMedication', () => {
        it('returns 404 when the medication does not exist', async () => {
            const req = { user: { id: 'u1' }, params: { id: 'x' }, body: {} };
            const res = mockRes();
            sinon.stub(Medication, 'findById').resolves(null);

            await updateMedication(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('returns 403 when the medication belongs to another user', async () => {
            const req = { user: { id: 'u1' }, params: { id: 'm1' }, body: { name: 'New' } };
            const res = mockRes();
            sinon.stub(Medication, 'findById').resolves({ user: { toString: () => 'someoneElse' } });

            await updateMedication(req, res);

            expect(res.status.calledWith(403)).to.be.true;
        });

        it('updates and returns 200 for the owner', async () => {
            const doc = { user: { toString: () => 'u1' }, save: sinon.stub().resolvesThis() };
            const req = { user: { id: 'u1' }, params: { id: 'm1' }, body: { dosage: '1000 mg' } };
            const res = mockRes();
            sinon.stub(Medication, 'findById').resolves(doc);

            await updateMedication(req, res);

            expect(doc.dosage).to.equal('1000 mg');
            expect(res.status.calledWith(200)).to.be.true;
        });
    });

    describe('deleteMedication', () => {
        it('deletes and returns 200 for the owner', async () => {
            const doc = { user: { toString: () => 'u1' }, deleteOne: sinon.stub().resolves() };
            const req = { user: { id: 'u1' }, params: { id: 'm1' } };
            const res = mockRes();
            sinon.stub(Medication, 'findById').resolves(doc);

            await deleteMedication(req, res);

            expect(doc.deleteOne.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        });
    });
});
