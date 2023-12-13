import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import {CreateLocationInput} from "./create-location.input";


@Resolver(() => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => Location, {description: "создание новой локации"})
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationService.create(createLocationInput);
  }

  @Query(() => [Location], { name: 'locationCollection' })
  findAll() {
    return this.locationService.findAll();
  }

  @Query(() => Location, { name: 'locationByID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.locationService.findOne(id);
  }

}
