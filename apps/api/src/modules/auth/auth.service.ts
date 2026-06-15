import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export async function login(dto: LoginDto) {
  const user =
     await usersRepository.findByEmail(
    dto.email
  );

  if (!user || !user.passwordHash) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  return {
    accessToken: generateToken({ id: user.id, email: user.email, username: user.username, role: user.role }),
    tokenType: 'Bearer',
  };
}

export async function register(dto: RegisterDto) {
  const existing =
    await usersRepository.findByEmailOrUsername(
      dto.email,
      dto.username
  );

  if (existing) {
    const field = existing.email === dto.email.toLowerCase() ? 'email' : 'username';
    throw { status: 409, message: `An account with this ${field} already exists.` };
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

export async function socialAuth(dto: SocialAuthDto) {
  // TODO: verificar token com o provedor (Apple/Facebook/GitHub/Google)
  throw { status: 501, message: `Social auth with ${dto.provider} not implemented yet.` };
}
