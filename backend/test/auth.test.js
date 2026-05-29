// Unit tests for the authentication controller (register + login).
// User model, bcrypt and jwt are stubbed so no database or real hashing is needed.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const expect = chai.expect;

const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');

const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('Auth Controller', () => {
    afterEach(() => sinon.restore());

    describe('registerUser', () => {
        it('rejects registration when the email already exists', async () => {
            const req = { body: { name: 'A', email: 'a@a.com', password: 'p' } };
            const res = mockRes();
            sinon.stub(User, 'findOne').resolves({ id: 'existing' });

            await registerUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('creates a new user and returns 201 with a token', async () => {
            const req = { body: { name: 'A', email: 'a@a.com', password: 'p' } };
            const res = mockRes();
            sinon.stub(User, 'findOne').resolves(null);
            sinon.stub(User, 'create').resolves({ id: 'u1', name: 'A', email: 'a@a.com' });

            await registerUser(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('token');
        });
    });

    describe('loginUser', () => {
        it('returns a token for valid credentials', async () => {
            const req = { body: { email: 'a@a.com', password: 'p' } };
            const res = mockRes();
            sinon.stub(User, 'findOne').resolves({ id: 'u1', name: 'A', email: 'a@a.com', password: 'hashed' });
            sinon.stub(bcrypt, 'compare').resolves(true);

            await loginUser(req, res);

            expect(res.json.firstCall.args[0]).to.have.property('token');
        });

        it('returns 401 for an invalid password', async () => {
            const req = { body: { email: 'a@a.com', password: 'wrong' } };
            const res = mockRes();
            sinon.stub(User, 'findOne').resolves({ id: 'u1', password: 'hashed' });
            sinon.stub(bcrypt, 'compare').resolves(false);

            await loginUser(req, res);

            expect(res.status.calledWith(401)).to.be.true;
        });
    });
});
