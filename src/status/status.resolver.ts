import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';


@Resolver(() => Status)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => [Status], { name: 'statusCollection' })
  findAll() {
    return this.statusService.findAll();
  }

  @Query(() => Status, { name: 'statusByID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.statusService.findOne(id);
  }

}
