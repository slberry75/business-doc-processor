import { Request, Response } from "express";
import { AuthController } from "../../src/controllers/auth.controller";
import { createMockRequest, createMockResponse } from "../utils/mockHelpers";

describe('AuthController Login Validation', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController();
    });

    describe('Login Validation', () => {

        it('should reject login attempts with invalid email format', async() => {

            const req = createMockRequest({
                email: 'invalid-email',
                password: 'ValidPass123!'
            }) as Request;
            const res = createMockResponse();

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringMatching(/email/i)
                })
            );
        });

        it('should reject login attempts with an empty password', async() => {

            const req = createMockRequest({
                email: 'test@abc.com',
                password: ''
            }) as Request;
            const res = createMockResponse();

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringMatching(/password/i)
                })
            );
        });
    })
    
})

