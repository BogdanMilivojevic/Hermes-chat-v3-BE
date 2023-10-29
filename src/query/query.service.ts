import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryService {
  userSearch(value: string) {
    return `SELECT * FROM "Users" WHERE "username" ILIKE '%${value}%'`;
  }
}
