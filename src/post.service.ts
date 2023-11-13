import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Person, Prisma } from '@prisma/client';

type GetPostsParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.PersonWhereUniqueInput;
  where?: Prisma.PersonWhereInput;
  orderBy?: Prisma.PersonOrderByWithRelationInput;
};

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(where: Prisma.PersonWhereUniqueInput): Promise<Person | null> {
    return this.prisma.person.findUnique({ where });
  }

  async posts(params: GetPostsParams) {
    return this.prisma.person.findMany(params);
  }

  async createPost(data: Prisma.PersonCreateInput): Promise<Person> {
    return this.prisma.person.create({ data });
  }

  async updatePost(params: {
    where: Prisma.PersonWhereUniqueInput;
    data: Prisma.PersonUpdateInput;
  }): Promise<Person> {
    return this.prisma.person.update(params);
  }

  async removePost(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prisma.person.delete({ where });
  }
}
