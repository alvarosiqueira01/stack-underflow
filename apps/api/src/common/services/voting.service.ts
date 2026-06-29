import { votesRepository } from '../repositories/votes.repository';

type VoteTargetType = 'question' | 'answer';
type VoteValue = 1 | -1;

interface VoteResolution {
  /** Quanto somar/subtrair do contador de votos do post (`voteCount`). */
  voteCountDelta: number;
  /** Voto atual do usuário após a operação — `0` quando foi removido (toggle off). */
  userVote: VoteValue | 0;
  /** Voto anterior do usuário, antes desta chamada — usado para reverter reputação. */
  previousValue: VoteValue | 0;
}

/**
 * Aplica a regra "1 voto por usuário por post" do Stack Overflow:
 * - sem voto anterior → registra o voto
 * - mesmo valor de novo → remove o voto (toggle off)
 * - valor diferente → troca o voto (ex: estava ▼, agora ▲)
 *
 * Não atualiza o contador no post nem a reputação do autor — isso é
 * responsabilidade de quem chama, que conhece os pontos de cada caso
 * (pergunta vale +5/-2, resposta vale +10/-2).
 */
export async function resolveVote(
  userId: string,
  targetType: VoteTargetType,
  targetId: string,
  value: VoteValue,
): Promise<VoteResolution> {
  const existing = await votesRepository.findUserVote(userId, targetType, targetId);
  const previousValue: VoteValue | 0 = existing ? (existing.value as VoteValue) : 0;

  if (existing && existing.value === value) {
    await votesRepository.deleteVote(userId, targetType, targetId);
    return { voteCountDelta: -value, userVote: 0, previousValue };
  }

  await votesRepository.upsertVote(userId, targetType, targetId, value);
  return { voteCountDelta: value - previousValue, userVote: value, previousValue };
}

/** Pontos de reputação para um valor de voto — usado para calcular a diferença ao trocar/remover. */
export function reputationFor(value: VoteValue | 0, upvotePoints: number, downvotePenalty: number): number {
  if (value === 1) return upvotePoints;
  if (value === -1) return downvotePenalty;
  return 0;
}
