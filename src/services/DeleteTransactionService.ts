import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne(transactionId);

    if (!transaction) throw new AppError('Transaction could not be found');

    await transactionsRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
