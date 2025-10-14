import { Injectable } from '@nestjs/common';
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

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(createTransactionDto);
    return await this.transactionsRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    return await this.transactionsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    await this.transactionsRepository.update(id, updateTransactionDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }

  async sync(transactions: any[]): Promise<void> {
    // Очищаем существующие транзакции
    await this.transactionsRepository.clear();
    
    // Сохраняем новые транзакции
    for (const transactionData of transactions) {
      const transaction = this.transactionsRepository.create(transactionData);
      await this.transactionsRepository.save(transaction);
    }
  }
}
