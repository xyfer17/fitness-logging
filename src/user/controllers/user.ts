import {
  ApiResponse,
  Request,
  ResponseUtility,
  RestController,
} from '@libs/boat';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { ExerciseDto, WeightDto } from '../dto';
import { AccessTokenGuard } from '@app/auth';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }

  @Post('create-exercise-log')
  async createExerciseLog(
    @Req() req: Request,
    @Body() body: ExerciseDto,
  ): Promise<ApiResponse> {
    const { user } = req;

    const result = await this.service.createExerciseLog(body, user.id);
    return ResponseUtility.sendSuccessResponse(result);
  }

  @Post('create-weight-log')
  async createWeightLog(
    @Req() req: Request,
    @Body() body: WeightDto,
  ): Promise<ApiResponse> {
    const { user } = req;
    const result = await this.service.createWeightLog(body, user.id);
    return ResponseUtility.sendSuccessResponse(result);
  }
}
