import { z } from 'zod';
import { registry } from '../../common/openapi/registry';

// -- LoginRequest

export const LoginSchema = registry.register(
  'Login',
  z
    .object({
      email: z.string().email().openapi({
        description: 'Registered e-mail address.',
        example: 'ada@stackunderflow.dev',
      }),
      password: z.string().min(6).openapi({
        description: 'Account password (min 6 characters).',
        example: 's3cr3tP@ss',
      }),
    })
    .openapi('Login'),
);

// -- RegisterRequest

export const RegisterSchema = registry.register(
  'Register',
  z
    .object({
      email: z.string().email().openapi({
        description: 'E-mail address — must be unique across all accounts.',
        example: 'ada@stackunderflow.dev',
      }),
      username: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, digits and underscores.')
        .openapi({
          description:
            'Unique username — lowercase letters, digits and underscores only (3–30 chars).',
          example: 'ada_lovelace',
        }),
      password: z.string().min(6).openapi({
        description: 'Account password (min 6 characters).',
        example: 's3cr3tP@ss',
      }),
    })
    .openapi('Register'),
);

// -- SocialAuthRequest

export const SocialAuthSchema = registry.register(
  'SocialAuth',
  z
    .object({
      provider: z.enum(['apple', 'facebook', 'github', 'google']).openapi({
        description: 'OAuth provider that issued the token.',
        example: 'github',
      }),
      token: z.string().openapi({
        description: 'Access token or ID token returned by the OAuth provider.',
        example: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      }),
    })
    .openapi('SocialAuth'),
);

// -- AuthToken — success response

export const AuthTokenSchema = registry.register(
  'AuthToken',
  z
    .object({
      accessToken: z.string().openapi({
        description: 'Signed JWT to be sent as `Authorization: Bearer <token>`.',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
      tokenType: z.string().default('Bearer').openapi({
        description: 'Token type — always "Bearer".',
        example: 'Bearer',
      }),
    })
    .openapi('AuthToken'),
);

// -- AuthUser — registration response

export const AuthUserSchema = registry.register(
  'AuthUser',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the created user.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      email: z.string().email().openapi({
        description: 'E-mail address of the new account.',
        example: 'ada@stackunderflow.dev',
      }),
      username: z.string().openapi({
        description: 'Chosen username.',
        example: 'ada_lovelace',
      }),
      role: z.enum(['new_user', 'user', 'established', 'moderator', 'admin']).openapi({
        description: 'Reputation-based role assigned at account creation.',
        example: 'new_user',
      }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of account creation.',
        example: '2024-06-01T12:00:00.000Z',
      }),
    })
    .openapi('AuthUser'),
);

// -- Inferred types (used by controllers / services)

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type SocialAuthDto = z.infer<typeof SocialAuthSchema>;
