import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDto, SignInPatientDto } from './signInDto';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const userFind = await this.usersService.findOneEmail(signInDto.email);

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

    if (patients.length === 0) return { msg: 'paciente no existe' };

    const organizations = await Promise.all(
      patients.map(async (patient) => {
        const organizacion = await this.prismaService.organization.findFirst({
          where: { id: patient.organizationId },
        });
        if (!organizacion) {
          throw new UnauthorizedException('Organización no encontrada');
        }
        return {
          ...organizacion,
          patientId: patient.id,
        };
      }),
    );

    const payload = {
      organizations: organizations,
    };

    console.log('Payload:', payload);

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
