import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { SignInDto, SignInPatientDto } from './signInDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Organization } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneEmail(signInDto.email);
    if (!user) {
      await this.usersService.create({
        email: signInDto.email,
        password: signInDto.password,
      });
    }
    const userFind = await this.usersService.findOneEmail(signInDto.email)

    const payload = { user: userFind };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signInPatient(signInPatientDto: SignInPatientDto) {
    const patients = await this.prismaService.patient.findMany({
      where: {
        ci: signInPatientDto.ci,
        email: signInPatientDto.email,
      },
    });
    
    if(patients.length === 0)
      return {msg:"paciente no existe"}

    const organizations: Organization[] = [];
    patients.forEach(async (patient) => {
      const organizacion = await this.prismaService.organization.findFirst({
        where: {
          id: patient.organizationId,
        },
      });
      if (organizacion) {
        organizations.push(organizacion);
      }
    });

    const payload = {
      patient: patients[0],
      organizations: organizations,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
