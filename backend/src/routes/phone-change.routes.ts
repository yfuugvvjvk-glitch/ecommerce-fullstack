import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';
import { verificationService } from '../services/verification.service';
import { authMiddleware } from '../middleware/auth.middleware';

// Validation schemas
const ChangePhoneSchema = z.object({
  newPhone: z.string().min(10, 'Numărul de telefon trebuie să conțină cel puțin 10 caractere.'),
});

const VerifyPhoneChangeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Codul de verificare trebuie să conțină exact 6 cifre.'),
});

/**
 * Phone Change Routes
 * 
 * Handles phone number change verification flow via email:
 * 1. POST /api/user/change-phone - Initiate phone change (authenticated)
 * 2. POST /api/user/verify-phone-change - Verify phone change with code (authenticated)
 * 3. POST /api/user/resend-phone-code - Resend verification code (authenticated)
 * 
 * Requirements: 4.1, 4.2, 4.4, 4.7
 */
export async function phoneChangeRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/user/change-phone
   * Initiate phone number change process
   * 
   * Sends verification code to user's current email address.
   * 
   * Requirements:
   * - 4.1: Generate 6-digit verification code
   * - 4.2: Send verification code to user's current email address
   */
  fastify.post(
    '/change-phone',
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        const body = ChangePhoneSchema.parse(request.body);
        const userId = request.user!.userId;

        const result = await verificationService.sendPhoneChangeCode(
          userId,
          body.newPhone
        );

        if (result.success) {
          return reply.status(200).send({
            success: true,
            message: result.message,
          });
        } else {
          return reply.status(400).send({
            success: false,
            error: result.message,
          });
        }
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            success: false,
            error: 'Eroare de validare',
            details: error.issues.map(issue => issue.message),
          });
        }

        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'A apărut o eroare la procesarea cererii. Vă rugăm să încercați din nou.',
        });
      }
    }
  );

  /**
   * POST /api/user/verify-phone-change
   * Verify phone change with code
   * 
   * Validates the verification code and updates the user's phone number.
   * 
   * Requirements:
   * - 4.3: Validate code against stored hashed code
   * - 4.4: Update user's phone number on successful verification
   */
  fastify.post(
    '/verify-phone-change',
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        const body = VerifyPhoneChangeSchema.parse(request.body);
        const userId = request.user!.userId;

        const result = await verificationService.verifyPhoneChangeCode(
          userId,
          body.code
        );

        if (result.success) {
          return reply.status(200).send({
            success: true,
            message: result.message,
            user: result.user,
          });
        } else {
          return reply.status(400).send({
            success: false,
            error: result.message,
            remainingAttempts: result.remainingAttempts,
          });
        }
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            success: false,
            error: 'Eroare de validare',
            details: error.issues.map(issue => issue.message),
          });
        }

        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'A apărut o eroare la verificarea codului. Vă rugăm să încercați din nou.',
        });
      }
    }
  );

  /**
   * POST /api/user/resend-phone-code
   * Resend phone change verification code
   * 
   * Invalidates the previous code and sends a new verification code.
   * 
   * Requirements:
   * - 4.7: Invalidate previous code and generate new one
   */
  fastify.post(
    '/resend-phone-code',
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;

        // Get the user to retrieve the phone number from the pending verification
        const verificationCode = await verificationService.getCodesByIdentifierAndType(
          userId,
          'PHONE_CHANGE'
        );

        if (!verificationCode || verificationCode.length === 0) {
          return reply.status(400).send({
            success: false,
            error: 'Nu există o solicitare de schimbare a numărului de telefon în curs.',
          });
        }

        // Get the most recent code to retrieve the new phone number
        const latestCode = verificationCode[0];
        const newPhone = latestCode.phone;

        if (!newPhone) {
          return reply.status(400).send({
            success: false,
            error: 'Numărul de telefon nu a fost găsit.',
          });
        }

        // Send new code (this will invalidate the previous one)
        const result = await verificationService.sendPhoneChangeCode(
          userId,
          newPhone
        );

        if (result.success) {
          return reply.status(200).send({
            success: true,
            message: result.message,
          });
        } else {
          return reply.status(400).send({
            success: false,
            error: result.message,
          });
        }
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'A apărut o eroare la trimiterea codului. Vă rugăm să încercați din nou.',
        });
      }
    }
  );
}
