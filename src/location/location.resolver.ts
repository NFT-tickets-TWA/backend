import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import {CreateLocationInput} from "./create-location.input";
import {Logger} from "@nestjs/common";


@Resolver(() => Location)
export class LocationResolver {
  private readonly logger = new Logger(LocationResolver.name)
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => Location, {description: "создание новой локации"})
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    this.logger.log("create location request")
    return this.locationService.create(createLocationInput);
  }

  @Query(() => [Location], { name: 'locationCollection' })
  findAll() {
    this.logger.log("location collection request")
    return this.locationService.findAll();
  }

  @Query(() => Location, { name: 'locationByID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    this.logger.log("get location by id request")
    return this.locationService.findOne(id);
  }

}
