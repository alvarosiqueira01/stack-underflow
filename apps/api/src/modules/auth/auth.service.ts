import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../../common/errors/http-error';
import { REPUTATION_THRESHOLDS } from '../../common/constants/reputation-thresholds';
import { usersRepository } from '../../common/repositories/users.repository';
import { env } from '../../config/env.config';
import type { LoginDto, RegisterDto, SocialAuthDto } from './auth.schema';

const SALT_ROUNDS = 10;

function generateToken(user: { id: string; email: string; username: string; role: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
  );
}

function toAuthSession(user: {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  reputation: number;
  badges?: { gold: number; silver: number; bronze: number } | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    reputation: user.reputation,
    badges: user.badges ?? { gold: 0, silver: 0, bronze: 0 },
    permissions: {
      canComment: user.reputation >= REPUTATION_THRESHOLDS.COMMENT,
      canCreateTag: user.reputation >= REPUTATION_THRESHOLDS.CREATE_TAG,
    },
  };
}

export async function login(dto: LoginDto) {
  const user =
     await usersRepository.findByEmail(
    dto.email
  );

  if (!user || !user.passwordHash) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  return {
    accessToken: generateToken({ id: user.id, email: user.email, username: user.username, role: user.role }),
    user: toAuthSession(user),
  };
}

export async function getSession(userId: string) {
  const user = await usersRepository.findById(userId);
  if (!user) throw new HttpError(401, 'Session is no longer valid.');

  return toAuthSession(user);
}

export async function register(dto: RegisterDto) {
  const existing =
    await usersRepository.findByEmailOrUsername(
      dto.email,
      dto.username
  );

  if (existing) {
    const field = existing.email === dto.email.toLowerCase() ? 'email' : 'username';
    throw new HttpError(409, `An account with this ${field} already exists.`);
  }

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user =
    await usersRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      username: dto.username.toLowerCase(),
      passwordHash,
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function socialAuth(dto: SocialAuthDto): Promise<{
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    reputation: number;
    badges: { gold: number; silver: number; bronze: number };
    permissions: { canComment: boolean; canCreateTag: boolean };
  };
}> {
  // TODO: verificar token com o provedor (Apple/Facebook/GitHub/Google)
  throw new HttpError(501, `Social auth with ${dto.provider} not implemented yet.`);
}
