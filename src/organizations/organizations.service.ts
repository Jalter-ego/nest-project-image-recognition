import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prismaService.organization.create({
      data: createOrganizationDto,
    });
  }

  findAll() {
    return this.prismaService.organization.findMany();
  }

  findAllByUser(email: string,isActive:boolean) {
    return this.prismaService.organization.findMany({
      where: {
        hostUser: email
      },
      include:{
        subscriptions:{
          where:{
            isActive: isActive
          },
          include:{
            plan:true
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prismaService.organization.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: string) {
    return this.prismaService.organization.delete({
      where: {
        id: id,
      },
    });
  }
}
