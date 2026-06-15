const databaseName = process.env.MONGO_DATABASE || 'stack_underflow';
const appUser = process.env.MONGO_APP_USERNAME || 'stack_user';
const appPassword = process.env.MONGO_APP_PASSWORD || 'stack_password';

const db = db.getSiblingDB(databaseName);

const existingAppUser = db.getUser(appUser);
if (!existingAppUser) {
  db.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [{ role: 'readWrite', db: databaseName }],
  });
}

const now = new Date();
const passwordHash = '$2b$10$Fmz4K0r2TDsCrq5s.5UzLePWwRBS4k7vsAhvjBEwmBQT.50TPdi16';

const users = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9001'),
    name: 'Alvaro Siqueira',
    username: 'alvaro',
    email: 'alvaro@example.com',
    passwordHash,
    avatarUrl: null,
    bio: 'Maintainer do StackUnderflow.',
    isActive: true,
    location: 'Fortaleza, CE',
    website: 'https://github.com/alvarosiqueira01',
    reputation: 1200,
    role: 'admin',
    badges: { gold: 1, silver: 3, bronze: 8 },
    topTags: [
      ObjectId('665f1a2b3c4d5e6f7a8b9101'),
      ObjectId('665f1a2b3c4d5e6f7a8b9102'),
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9002'),
    name: 'Maria Oliveira',
    username: 'maria',
    email: 'maria@example.com',
    passwordHash,
    avatarUrl: null,
    bio: 'Frontend developer.',
    isActive: true,
    location: 'Recife, PE',
    website: 'https://example.com',
    reputation: 360,
    role: 'established',
    badges: { gold: 0, silver: 2, bronze: 5 },
    topTags: [
      ObjectId('665f1a2b3c4d5e6f7a8b9103'),
      ObjectId('665f1a2b3c4d5e6f7a8b9104'),
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9003'),
    name: 'Joao Pereira',
    username: 'joao',
    email: 'joao@example.com',
    passwordHash,
    avatarUrl: null,
    bio: 'Backend learner.',
    isActive: true,
    location: 'Sobral, CE',
    website: '',
    reputation: 45,
    role: 'new_user',
    badges: { gold: 0, silver: 0, bronze: 2 },
    topTags: [ObjectId('665f1a2b3c4d5e6f7a8b9102')],
    createdAt: now,
    updatedAt: now,
  },
];

const tags = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9101'),
    name: 'typescript',
    slug: 'typescript',
    description: 'Perguntas sobre TypeScript.',
    totalQuestions: 2,
    questionsToday: 1,
    questionsThisWeek: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9102'),
    name: 'mongodb',
    slug: 'mongodb',
    description: 'Modelagem, consultas e conexoes MongoDB.',
    totalQuestions: 1,
    questionsToday: 1,
    questionsThisWeek: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9103'),
    name: 'nextjs',
    slug: 'nextjs',
    description: 'Frontend com Next.js.',
    totalQuestions: 1,
    questionsToday: 0,
    questionsThisWeek: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9104'),
    name: 'docker',
    slug: 'docker',
    description: 'Containers, imagens e docker-compose.',
    totalQuestions: 1,
    questionsToday: 1,
    questionsThisWeek: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const questions = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9201'),
    title: 'Como configurar MONGO_URI dentro do docker-compose?',
    body: 'Estou subindo uma API Express em container e preciso conectar no MongoDB que tambem esta no docker-compose. Qual hostname devo usar dentro da rede do Docker?',
    expectedResult: 'Quero que a API conecte automaticamente ao banco ao iniciar.',
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9003'),
    tags: [
      ObjectId('665f1a2b3c4d5e6f7a8b9102'),
      ObjectId('665f1a2b3c4d5e6f7a8b9104'),
    ],
    voteCount: 3,
    answerCount: 1,
    commentCount: 1,
    viewCount: 18,
    acceptedAnswerId: ObjectId('665f1a2b3c4d5e6f7a8b9301'),
    status: 'open',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9202'),
    title: 'Como tipar corretamente um middleware de validacao com Zod 4?',
    body: 'Depois de atualizar para Zod 4, o tipo AnyZodObject nao existe mais e ZodError nao possui errors. Qual a forma correta de tipar um middleware generico?',
    expectedResult: 'Preciso de um middleware reutilizavel para body, params e query.',
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9002'),
    tags: [
      ObjectId('665f1a2b3c4d5e6f7a8b9101'),
    ],
    voteCount: 5,
    answerCount: 1,
    commentCount: 0,
    viewCount: 31,
    acceptedAnswerId: null,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  },
];

const answers = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9301'),
    body: 'Dentro da rede do Compose voce usa o nome do servico como hostname. Se o servico chama mongodb, a URI fica mongodb://usuario:senha@mongodb:27017/stack_underflow?authSource=stack_underflow.',
    questionId: ObjectId('665f1a2b3c4d5e6f7a8b9201'),
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9001'),
    voteCount: 4,
    commentCount: 0,
    isAccepted: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9302'),
    body: 'No Zod 4, use z.ZodType para aceitar schemas genericos e leia os problemas de validacao por error.issues em vez de error.errors.',
    questionId: ObjectId('665f1a2b3c4d5e6f7a8b9202'),
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9001'),
    voteCount: 2,
    commentCount: 0,
    isAccepted: false,
    createdAt: now,
    updatedAt: now,
  },
];

const comments = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9401'),
    body: 'Use o nome do servico no Compose, nao localhost.',
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9002'),
    targetType: 'question',
    targetId: ObjectId('665f1a2b3c4d5e6f7a8b9201'),
    status: 'visible',
    createdAt: now,
    updatedAt: now,
  },
];

const reviews = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9501'),
    type: 'suggested_edit',
    targetType: 'question',
    targetId: ObjectId('665f1a2b3c4d5e6f7a8b9202'),
    authorId: ObjectId('665f1a2b3c4d5e6f7a8b9003'),
    beforeContent: 'Como tipar middleware com Zod?',
    afterContent: 'Como tipar corretamente um middleware de validacao com Zod 4?',
    editSummary: 'Melhora o titulo e explicita a versao do Zod.',
    status: 'pending',
    decisions: [],
    createdAt: now,
    updatedAt: now,
  },
];

const preferences = [
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9601'),
    userId: ObjectId('665f1a2b3c4d5e6f7a8b9002'),
    tagId: ObjectId('665f1a2b3c4d5e6f7a8b9101'),
    status: 'watching',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId('665f1a2b3c4d5e6f7a8b9602'),
    userId: ObjectId('665f1a2b3c4d5e6f7a8b9003'),
    tagId: ObjectId('665f1a2b3c4d5e6f7a8b9104'),
    status: 'watching',
    createdAt: now,
    updatedAt: now,
  },
];

function insertIfEmpty(collectionName, documents) {
  if (db[collectionName].countDocuments() === 0) {
    db[collectionName].insertMany(documents);
  }
}

insertIfEmpty('users', users);
insertIfEmpty('tags', tags);
insertIfEmpty('questions', questions);
insertIfEmpty('answers', answers);
insertIfEmpty('comments', comments);
insertIfEmpty('reviews', reviews);
insertIfEmpty('usertagpreferences', preferences);

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ name: 'text', username: 'text' });
db.tags.createIndex({ name: 1 }, { unique: true });
db.tags.createIndex({ slug: 1 }, { unique: true });
db.tags.createIndex({ name: 'text', description: 'text' });
db.questions.createIndex({ title: 'text', body: 'text' });
db.questions.createIndex({ tags: 1 });
db.answers.createIndex({ questionId: 1, isAccepted: -1, voteCount: -1 });
db.comments.createIndex({ targetType: 1, targetId: 1, createdAt: 1 });
db.reviews.createIndex({ status: 1, type: 1, createdAt: 1 });
db.usertagpreferences.createIndex({ userId: 1, tagId: 1 }, { unique: true });

print(`Initialized ${databaseName} database with app user ${appUser} and seed data.`);
