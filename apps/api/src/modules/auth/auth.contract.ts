import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  AuthTokenSchema,
  AuthUserSchema,
  LoginSchema,
  RegisterSchema,
  SocialAuthSchema,
} from './auth.schema';

// -- POST /api/auth/login

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Login com e-mail e senha',
  description:
    'Valida as credenciais fornecidas e retorna um JWT assinado ' +
    'que deve ser enviado como `Authorization: Bearer <token>` nas requisições subsequentes.',
  request: {
    body: {
      required: true,
      description: 'Credenciais do usuário.',
      content: { 'application/json': { schema: LoginSchema } },
    },
  },
  responses: {
    200: {
      description: 'Credenciais aceitas — token JWT retornado.',
      content: { 'application/json': { schema: AuthTokenSchema } },
    },
    400: commonErrorResponses[400],
    401: {
      description: 'Não autorizado — e-mail não encontrado ou senha incorreta.',
      content: commonErrorResponses[401].content,
    },
  },
});

// -- POST /api/auth/register

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Criar nova conta',
  description:
    'Registra uma nova conta de usuário no nível **Novo Usuário**. ' +
    'O e-mail e o nome de usuário devem ser únicos na plataforma.',
  request: {
    body: {
      required: true,
      description: 'Dados de cadastro da nova conta.',
      content: { 'application/json': { schema: RegisterSchema } },
    },
  },
  responses: {
    201: {
      description: 'Conta criada — dados do novo usuário retornados.',
      content: { 'application/json': { schema: AuthUserSchema } },
    },
    400: commonErrorResponses[400],
    409: {
      description: 'Conflito — já existe uma conta com este e-mail ou nome de usuário.',
      content: { 'application/json': { schema: commonErrorResponses[400].content['application/json'].schema } },
    },
  },
});

// -- POST /api/auth/social

registry.registerPath({
  method: 'post',
  path: '/api/auth/social',
  tags: ['Auth'],
  summary: 'Autenticar via provedor social',
  description:
    'Troca um token OAuth (emitido por Apple, Facebook, GitHub ou Google) por um ' +
    'JWT da plataforma. Se nenhuma conta estiver associada à identidade do provedor, ' +
    'uma nova conta é criada automaticamente no nível **Novo Usuário**.',
  request: {
    body: {
      required: true,
      description: 'Provedor OAuth e token obtido pelo fluxo OAuth no cliente.',
      content: { 'application/json': { schema: SocialAuthSchema } },
    },
  },
  responses: {
    200: {
      description: 'Token do provedor verificado — JWT da plataforma retornado.',
      content: { 'application/json': { schema: AuthTokenSchema } },
    },
    400: commonErrorResponses[400],
    401: {
      description: 'Não autorizado — token do provedor inválido ou expirado.',
      content: commonErrorResponses[401].content,
    },
  },
});
