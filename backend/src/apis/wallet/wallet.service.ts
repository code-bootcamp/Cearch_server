import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getConnection, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async findPlus({ currentUser }) {
    const charging = await getConnection()
      .createQueryBuilder(Wallet, 'wallet')
      .innerJoinAndSelect('wallet.user', 'user')
      .where('user.id = :id', { id: currentUser.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('wallet.division = :division', {
            division: '획득',
          }).orWhere({ division: '충전' });
        }),
      )
      .orderBy('wallet.createdAt', 'DESC')
      .getMany();
    console.log(charging);
    return charging;
  }

  async findMinus({ currentUser }) {
    const minus = await getConnection()
      .createQueryBuilder(Wallet, 'wallet')
      .innerJoinAndSelect('wallet.user', 'user')
      .where('user.id = :id', { id: currentUser.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('wallet.division = :division', {
            division: '인출',
          }).orWhere({ division: '환불' });
        }),
      )
      .orderBy('wallet.createdAt', 'DESC')
      .getMany();
    return minus;
  }
}
