import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { AuthService } from '../auth/auth.service';
import { AUTH_KIND } from '../auth/entities/auth.entity';
import { MentorForm } from './dto/mentoForm.input';
import { UserForm } from './dto/user.input';
import { MentoInfo } from './entities/mento.entity';
import { User, USER_ROLE } from './entities/user.entity';
import { UserService } from './user.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Query(() => [MentoInfo])
  async fetchHomeSearch(@Args('search') search: string) {
    const result = await this.elasticsearchService.search({
      index: 'mentor', // 테이블명
      query: {
        bool: {
          should: [{ match: { name: search } }],
          must: [
            { match: { role: 'MENTOR' } },
            { match: { mentostatus: 'AUTHORIZED' } },
          ],
        },
      },
    });
    console.log(result.hits.hits);
    const resultarray = result.hits.hits.map((ele: any) => ({
      id: ele._source.id,
      companyname: ele._source.companyname,
      department: ele._source.department,
      name: ele._source.name,
    }));
    console.log(resultarray);
    if (!resultarray) throw '검색결과가 없습니다.';
    return resultarray;
  }

  @Query(() => User)
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.MENTOR)
  async fetchMentorUser(@CurrentUser() currentUser: IcurrentUser) {
    return await this.userService.findMentoPage({ currentUser });
  }
  @Query(() => User)
  @UseGuards(GqlAccessGuard)
  async fetchUser(@CurrentUser() currentUser: IcurrentUser) {
    return await this.userService.findMyPage({ currentUser });
  }

  @Query(() => Boolean)
  async isCheckEmail(
    @Args('email') email: string, //
  ) {
    return await this.userService.isCheckEmail({ email });
  }

  @Query(() => Boolean)
  async phoneCheckToken(
    @Args('phoneNumber') phoneNumber: string,
    @Args('inputToken') inputToken: string,
  ) {
    return await this.authService.checkToken({
      indexer: phoneNumber,
      inputToken,
      kind: AUTH_KIND.PHONE,
    });
  }

  @Query(() => Boolean)
  async emailCheckToken(
    @Args('email') email: string,
    @Args('inputToken') inputToken: string, //
  ) {
    return await this.authService.checkToken({
      indexer: email,
      kind: AUTH_KIND.EMAIL,
      inputToken,
    });
  }

  @Mutation(() => User)
  async createUser(
    @Args('userForm') userForm: UserForm, //
  ) {
    //   await this.elasticsearchService.create({
    //   id: 'myid1', //nosql
    //   index: 'mentor', // 테이블이나 컬렉션을 의미
    //   document: {
    //     ...userForm,
    //   },
    // });
    return await this.userService.saveForm({ userForm });
  }

  @Mutation(() => String)
  async sendPhoneNumber(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    const authNumber = await this.authService.makeToken({
      indexer: phoneNumber,
      kind: AUTH_KIND.PHONE,
    });
    const result = await this.authService.sendTokenPhone({
      phoneNumber,
      authNumber,
    });
    return result;
  }

  @Mutation(() => String)
  async sendEmailToken(
    @Args('email') email: string, //
  ) {
    const authNumber = await this.authService.makeToken({
      indexer: email,
      kind: AUTH_KIND.EMAIL,
    });
    const result = await this.authService.sendTokenEmail({ email, authNumber });
    return result;
  }

  @Mutation(() => User)
  async updatePassword(
    @Args('email') email: string,
    @Args('newPassword') newPassword: string, //
  ) {
    return await this.userService.updatePassword({ email, newPassword });
  }

  @Mutation(() => MentoInfo)
  async authMentor(@Args('userId') userId: string) {
    return await this.userService.promoteMento({ userId });
  }

  @Mutation(() => MentoInfo)
  @UseGuards(GqlAccessGuard)
  async sendMentorForm(
    @Args('mentorForm') mentorForm: MentorForm, //
    @Args({ name: 'category', type: () => [String] }) category: string[],
    @CurrentUser()
    currentUser: IcurrentUser,
  ) {
    return await this.userService.sendMentorForm({
      mentorForm,
      user: currentUser,
      category,
    });
  }

  @Query(() => [MentoInfo])
  async fetchMentor(
    @Args('page') page: number, //
  ) {
    return await this.userService.fetchMentor({ page });
  }

  @Query(() => [MentoInfo])
  async fetchSelectedTagMentor(
    @Args('page') page: number, //
    @Args('categoryName') categoryName: string,
  ) {
    return await this.userService.fetchMentorWithCategory({
      page,
      categoryName,
    });
  }

  @Query(() => [MentoInfo])
  async fetchAuthorMentor() {
    return await this.userService.fetchAuthorMentor();
  }

  @Mutation(() => MentoInfo)
  @UseGuards(GqlAccessGuard)
  async updateMentorInfo(
    @Args('mentorForm') mentorForm: MentorForm,
    @Args({ name: 'category', type: () => [String] }) category: string[],
    @CurrentUser() currentUser: IcurrentUser,
  ) {
    return await this.userService.updateMentoForm({
      user: currentUser,
      mentorForm,
      category,
    });
  }

  @Mutation(() => User)
  @UseGuards(GqlAccessGuard)
  async updateUserInfo(
    @Args('userForm') userForm: UserForm,
    @Args({ name: 'category', type: () => [String] }) category: string[],
    @CurrentUser() currentUser: IcurrentUser,
  ) {
    return await this.userService.updateUserForm({
      user: currentUser,
      category,
      userForm,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.ADMIN)
  async deleteUser(
    @CurrentUser() currentUser: IcurrentUser,
    @Args('userId') userId: string,
  ) {
    return await this.userService.delete({
      currentUser,
      userId,
    });
  }
}
