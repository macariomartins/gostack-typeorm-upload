import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsData = await this.loadCsvData(
      path.resolve(uploadConfig.directory, filename),
    );

    const createTransactionService = new CreateTransactionService();

    const transactions = transactionsData.map(
      async ({ title, type, value, category: categoryTitle }) => {
        const transaction = await createTransactionService.execute({
          title,
          type,
          value,
          categoryTitle,
        });

        return transaction;
      },
    );

    return new Promise<Transaction[]>(_ => transactions);
  }

  private async loadCsvData(filename: string): Promise<TransactionData[]> {
    const readStream = fs.createReadStream(filename);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCsv = readStream.pipe(parseStream);
    const transactions: TransactionData[] = [];

    parseCsv.on('data', (transaction: TransactionData) =>
      transactions.push(transaction),
    );

    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    return transactions;
  }
}

export default ImportTransactionsService;
