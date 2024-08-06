import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInDto } from './auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService){}


    @Post("signup")
    async signup(@Body() dto: AuthDto){
        console.log(dto);
        return this.service.signup(dto);
    }

    @Post("signin")
    async signin(@Body() dto: SignInDto){
        return this.service.signin(dto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
    
};
