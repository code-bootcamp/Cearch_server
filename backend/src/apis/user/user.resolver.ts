import { UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { IcurrentUser } from '../auth/auth.resolver';
import { AuthService } from '../auth/auth.service';
import { AUTH_KIND } from '../auth/entities/auth.entity';
import { MentorForm } from './dto/mentoForm.input';
import { UserForm } from './dto/user.input';
import { MentoInfo } from './entities/mento.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
  ) {}

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
  async authMentor(
    @Args('mentoId') mentoId: string, //
    @Args('userId') userId: string,
  ) {
    return await this.userService.promoteMento({ mentoId, userId });
  }

  @Mutation(() => MentoInfo)
  async sendMentorForm(
    @Args('mentorForm') mentorForm: MentorForm, //
    @Args('mentorId') mentorId: string,
  ) {
    return await this.userService.sendMentorForm({
      mentorForm,
      mentorId,
    });
  }
}
