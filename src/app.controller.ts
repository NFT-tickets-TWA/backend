import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

// import {User as UserModel, Post as PostModel, Event} from '@prisma/client';
import { EventService } from './event.service';
import { PersonService } from './person.service';
import { Event } from '@prisma/client';
// import { Post as PostModel, User as UserModel } from '@prisma/client';

type UserData = { email: string; name?: string };
/* id                     Int         @id @default(autoincrement())
  name                   String
  type                   EventType   @default(NOT_STATED)
  status                 EventStatus @default(CREATED)
  urlCover               String      @unique
  description            String?
  creator                Person      @relation(fields: [creatorID], references: [id])
  creatorID              Int
  started_at             DateTime?
  finished_at            DateTime?
  location               Location    @relation(fields: [locationID], references: [id])
  locationID             Int
  nftPattern             String?     @unique
  linkToTheCollection    String?     @unique
  registeredParticipants Int         @default(0)
  countOfRewardTokens    Int         @default(0)
  created_at             DateTime
  updated_at             DateTime
  WhiteList              WhiteList[]*/
type EventData = {
  name: string;
  type?: string;
  authorEmail: string;
};

@Controller('api')
export class AppController {
  constructor(
      private readonly eventService: EventService,
      private readonly personService: PersonService,
  ) {}

  @Get('eventss')
  async getEvents() {
    return this.eventService.events();
  }

  @Post('event')
  async createEvent(@Body() eventData: Event) {
    return this.eventService.createEvent(eventData);
  }

  // @Get('post/:id')
  // async getPostById(@Param('id') id: string): Promise<PostModel> {
  //     return this.postService.post({ id: Number(id) });
  // }
  //
  // @Get('feed')
  // async getPublishedPosts(): Promise<PostModel[]> {
  //     return this.postService.posts({
  //         where: {
  //             published: true,
  //         },
  //     });
  // }
  //
  // @Get('filtered-posts/:searchString')
  // async getFilteredPosts(
  //     @Param('searchString') searchString: string,
  // ): Promise<PostModel[]> {
  //     return this.postService.posts({
  //         where: {
  //             OR: [
  //                 {
  //                     title: { contains: searchString },
  //                 },
  //                 {
  //                     content: { contains: searchString },
  //                 },
  //             ],
  //         },
  //     });
  // }
  //
  // @Post('post')
  // async createDraft(@Body() postData: PostData): Promise<PostModel> {
  //     const { title, content, authorEmail } = postData;
  //
  //     return this.postService.createPost({
  //         title,
  //         content,
  //         author: {
  //             connect: { email: authorEmail },
  //         },
  //     });
  // }
  //
  // @Put('publish/:id')
  // async publishPost(@Param('id') id: string): Promise<PostModel> {
  //     return this.postService.updatePost({
  //         where: { id: Number(id) },
  //         data: { published: true },
  //     });
  // }
  //
  // @Delete('post/:id')
  // async removePost(@Param('id') id: string): Promise<PostModel> {
  //     return this.postService.removePost({ id: Number(id) });
  // }
  //
  // @Post('user')
  // async registerUser(@Body() userData: UserData): Promise<UserModel> {
  //     return this.userService.createUser(userData);
  // }
}
