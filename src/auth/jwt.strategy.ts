import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { User } from '../user/entity/User.entity';
import { JWTPayload } from "../interfaces/api-interfaces";
import { responseToInterface } from "../helpers/return-utils";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'S3cr3t',
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    const now = +Date.parse((new Date()).toISOString()).toString().substr(0, 10);
    const exp = payload.exp;
    const tokenTimeLeft = exp - now;
    if (tokenTimeLeft <= 0){
      throw new UnauthorizedException(responseToInterface(
        null, false, 'Your token has expired. Renew token please.'
      ))
    }
    const user: User = await this.authService.validateUser(payload.userId);
    if (!user){
      throw new UnauthorizedException(responseToInterface(
        null, false, 'Invalid access token.'
      ));
    }
    return { userId: payload.userId, token: user.token }
  }
}
