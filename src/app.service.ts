import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Info } from './entities/info.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
  ) {}

  async getInfo() {
    try {
      const info = await this.infoRepository.findOne({
        where: {},
        order: { id: 'DESC' },
      });

      if (!info) {
        return {
          message: 'No data found',
          environment: process.env.APP_ENV || 'dev',
        };
      }

      return {
        message: info.message,
        environment: process.env.APP_ENV || 'dev',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: 'Database connection failed',
        details: error.message,
        environment: process.env.APP_ENV || 'dev',
      };
    }
  }
}
