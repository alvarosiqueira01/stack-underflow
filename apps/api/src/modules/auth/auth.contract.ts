import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  AuthTokenSchema,
  AuthUserSchema,
  LoginSchema,
  RegisterSchema,
  SocialAuthSchema,
} from './auth.schema';

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Login with e-mail and password',
  description:
    'Validates the provided credentials and returns a signed JWT access token ' +
    'that must be sent as `Authorization: Bearer <token>` on subsequent requests.',
  request: {
    body: {
      required: true,
      description: 'User credentials.',
      content: { 'application/json': { schema: LoginSchema } },
    },
  },
  responses: {
    200: {
      description: 'Credentials accepted — JWT access token returned.',
      content: { 'application/json': { schema: AuthTokenSchema } },
    },
    400: commonErrorResponses[400],
    401: {
      description: 'Unauthorized — e-mail not found or password is incorrect.',
      content: commonErrorResponses[401].content,
    },
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Create a new account',
  description:
    'Registers a new user account at the **New User** reputation level. ' +
    'The e-mail and username must be unique across the platform.',
  request: {
    body: {
      required: true,
      description: 'Registration details for the new account.',
      content: { 'application/json': { schema: RegisterSchema } },
    },
  },
  responses: {
    201: {
      description: 'Account created — newly registered user returned.',
      content: { 'application/json': { schema: AuthUserSchema } },
    },
    400: commonErrorResponses[400],
    409: {
      description: 'Conflict — an account with this e-mail or username already exists.',
      content: { 'application/json': { schema: commonErrorResponses[400].content['application/json'].schema } },
    },
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/social
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/auth/social',
  tags: ['Auth'],
  summary: 'Authenticate via social provider',
  description:
    'Exchanges an OAuth token (issued by Apple, Facebook, GitHub or Google) for a ' +
    'platform JWT. If no account is associated with the provider identity, one is ' +
    'created automatically at the **New User** level.',
  request: {
    body: {
      required: true,
      description: 'OAuth provider and token obtained from the client-side OAuth flow.',
      content: { 'application/json': { schema: SocialAuthSchema } },
    },
  },
  responses: {
    200: {
      description: 'Provider token verified — platform JWT returned.',
      content: { 'application/json': { schema: AuthTokenSchema } },
    },
    400: commonErrorResponses[400],
    401: {
      description: 'Unauthorized — the provider token is invalid or expired.',
      content: commonErrorResponses[401].content,
    },
  },
});
