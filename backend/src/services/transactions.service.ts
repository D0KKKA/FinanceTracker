import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto & { userId: string }): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(createTransactionDto);
    return await this.transactionsRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUser(userId: string): Promise<Transaction[]> {
    return await this.transactionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    return await this.transactionsRepository.findOne({ where: { id } });
  }

  async findOneByUser(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    await this.transactionsRepository.update(id, updateTransactionDto);
    return await this.findOne(id);
  }

  async updateByUser(id: string, updateTransactionDto: UpdateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = await this.findOneByUser(id, userId);

    if (transaction.userId !== userId) {
      throw new ForbiddenException('You can only update your own transactions');
    }

    await this.transactionsRepository.update(id, updateTransactionDto);
    return await this.findOneByUser(id, userId);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }

  async removeByUser(id: string, userId: string): Promise<void> {
    const transaction = await this.findOneByUser(id, userId);

    if (transaction.userId !== userId) {
      throw new ForbiddenException('You can only delete your own transactions');
    }

    await this.transactionsRepository.delete(id);
  }

  async sync(transactions: any[], userId: string): Promise<void> {
    // Удаляем существующие транзакции пользователя
    await this.transactionsRepository.delete({ userId });

    // Сохраняем новые транзакции
    for (const transactionData of transactions) {
      const transaction = this.transactionsRepository.create({
        ...transactionData,
        userId,
      });
      await this.transactionsRepository.save(transaction);
    }
  }
}
