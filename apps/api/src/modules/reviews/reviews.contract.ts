import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  ReviewActionResponseSchema,
  ReviewActionSchema,
  ReviewQueueSchema,
  ReviewTaskSchema,
} from './reviews.schema';

const bearerAuth = [{ bearerAuth: [] }];

// -- GET /api/reviews

registry.registerPath({
  method: 'get',
  path: '/api/reviews',
  tags: ['Reviews'],
  summary: 'Listar filas de revisão',
  description:
    'Retorna todas as filas de moderação (Edições Sugeridas, Votos de Fechamento, Posts de Baixa Qualidade) ' +
    'com a quantidade de tarefas pendentes em cada uma. ' +
    'Requer que o usuário tenha reputação suficiente para acessar as filas de revisão.',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Filas de revisão retornadas com contagem de tarefas pendentes.',
      content: {
        'application/json': {
          schema: z.array(ReviewQueueSchema),
        },
      },
    },
    401: commonErrorResponses[401],
    403: {
      description: 'Proibido — reputação insuficiente para acessar as filas de revisão.',
      content: commonErrorResponses[403].content,
    },
  },
});

// -- GET /api/reviews/{id}

registry.registerPath({
  method: 'get',
  path: '/api/reviews/{id}',
  tags: ['Reviews'],
  summary: 'Detalhes de uma tarefa de revisão',
  description:
    'Retorna o detalhe completo de uma tarefa de revisão, incluindo o diff campo a campo ' +
    'entre o conteúdo original e a edição sugerida.',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId MongoDB inválido')
        .openapi({
          description: 'ObjectId MongoDB da tarefa de revisão.',
          example: '665f1a2b3c4d5e6f7a8b9c0d',
        }),
    }),
  },
  responses: {
    200: {
      description: 'Tarefa encontrada — detalhe com diff retornado.',
      content: { 'application/json': { schema: ReviewTaskSchema } },
    },
    401: commonErrorResponses[401],
    404: commonErrorResponses[404],
  },
});

// -- POST /api/reviews/{id}/action

registry.registerPath({
  method: 'post',
  path: '/api/reviews/{id}/action',
  tags: ['Reviews'],
  summary: 'Enviar decisão de revisão',
  description:
    'Registra a decisão do revisor autenticado para uma tarefa de revisão pendente. ' +
    'Ações possíveis: **aprovar**, **rejeitar** (requer `rejectionReasons`), ' +
    '**melhorar** ou **pular**. ' +
    'Requer alta reputação — apenas Usuários Estabelecidos e acima podem revisar.',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId MongoDB inválido')
        .openapi({
          description: 'ObjectId MongoDB da tarefa a ser avaliada.',
          example: '665f1a2b3c4d5e6f7a8b9c0d',
        }),
    }),
    body: {
      required: true,
      description: 'Decisão de revisão com motivos de rejeição opcionais.',
      content: { 'application/json': { schema: ReviewActionSchema } },
    },
  },
  responses: {
    200: {
      description: 'Decisão registrada — confirmação retornada.',
      content: { 'application/json': { schema: ReviewActionResponseSchema } },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    403: {
      description: 'Proibido — reputação insuficiente para enviar uma revisão.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});
