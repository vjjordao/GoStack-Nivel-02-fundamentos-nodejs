import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        return transaction.value;
      }
      return 0;
    });

    const outcomeTransactions = this.transactions.map(transaction => {
      if (transaction.type === 'outcome') {
        return transaction.value;
      }
      return 0;
    });

    const income = incomeTransactions.reduce((prev, curr) => prev + curr, 0);
    const outcome = outcomeTransactions.reduce((prev, curr) => prev + curr, 0);

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('You have no money!');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
