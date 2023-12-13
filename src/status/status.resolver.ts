import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StatusService } from './status.service';


@Resolver(() => String)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => [String], { name: 'statusCollection' })
  findAll() {
    return this.statusService.findAll();
  }


}
