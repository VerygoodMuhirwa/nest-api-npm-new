import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignInDto } from './auth.dto';
import * as argon from "argon2"
import {JwtService} from "@nestjs/jwt"
@Injectable()
export class AuthService {
 constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService

 ){}
 async signup(dto: AuthDto){
    const userExists = await this.prisma.user.findUnique({ where : { email: dto.email}})
    if(userExists)throw new ConflictException("The user with that email already exists")
    const hashedPassword = await argon.hash(dto.password)

    const userData=  {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName:dto.lastName
    }
    
    const user = await this.prisma.user.create({
        data : userData })

    delete user.password 
    return user;
 }



 async signin(dto: SignInDto) : Promise<{message: string, accessToken : string}>{
    const userExists = await this.prisma.user.findUnique({where: { email: dto.email}})
    if(!userExists)throw new UnauthorizedException("Invalid password or email")
    
    const pwMatches = await argon.verify(userExists.password,dto.password)   
    if(!pwMatches)throw new UnauthorizedException("Invalid password or email") 
    
    const payload = { sub: userExists.id, firstName: userExists.firstName, lastname: userExists.lastName  };
    return {message : "User logged in successfully", accessToken: await this.jwtService.signAsync(payload) }
 }   
}
