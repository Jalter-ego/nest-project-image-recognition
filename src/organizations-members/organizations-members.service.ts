import { Injectable } from '@nestjs/common';
import { CreateOrganizationsMemberDto } from './dto/create-organizations-member.dto';
import { UpdateOrganizationsMemberDto } from './dto/update-organizations-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsMembersService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrganizationsMemberDto: CreateOrganizationsMemberDto) {
  const { organizationId, userId, role } = createOrganizationsMemberDto;
  const existingMember = await this.prismaService.organizationMember.findFirst({
    where: {
      organizationId,
      userId,
    },
  });

  if (existingMember) {
    throw new Error('El usuario ya pertenece a esta organización');
  }
  
  return this.prismaService.organizationMember.create({
    data: {
      role,
      organizationId,
      userId,
    },
  });
}


  findAll() {
    return this.prismaService.organizationMember.findMany();
  }

  findAllByOrganization(organizationId: string){
    return this.prismaService.organizationMember.findMany({
      where:{
        organizationId:organizationId
      },
      include:{
        user:{
          select:{
            email:true
          }
        }  
      }
    })
  }

  findAllByUser(userId: string){
    return this.prismaService.organizationMember.findMany({
      where:{
        userId:userId
      },
      include:{
        organization:{
          include:{
            subscriptions:{
              include:{
                plan:true
              }
            }
          }
        }
      }
    })
  }

  findOne(id: string) {
    return this.prismaService.organizationMember.findFirst({
      where:{
        id:id
      }
    });
  }

  update(
    id: string,
    updateOrganizationsMemberDto: UpdateOrganizationsMemberDto,
  ) {
    return `This action updates a #${id} organizationsMember`;
  }

  remove(id: string) {
    return this.prismaService.organizationMember.delete({
      where:{
        id:id
      }
    });
  }
}
