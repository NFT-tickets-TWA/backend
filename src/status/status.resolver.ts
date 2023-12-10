import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';


@Resolver(() => Status)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => [Status], { name: 'status' })
  findAll() {
    return this.statusService.findAll();
  }

  @Query(() => Status, { name: 'status' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.statusService.findOne(id);
  }

}
