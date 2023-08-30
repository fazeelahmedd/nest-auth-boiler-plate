import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoutesResponse } from 'src/modules/routes/dto/routes-response.dto';

@Exclude()
export class RoutePermissionResponse extends OmitType(RoutesResponse, [
  'user_roles',
] as const) {}
