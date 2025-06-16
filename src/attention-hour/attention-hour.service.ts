import { Injectable } from '@nestjs/common';
import { AddAttHourUser, AddMultipleAttHourUsers, CreateAttentionHourDto } from './dto/create-attention-hour.dto';
import { UpdateAttentionHourDto } from './dto/update-attention-hour.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttentionHourService {
  constructor(
    private prismaService: PrismaService
  ) { }
  create(createAttentionHourDto: CreateAttentionHourDto) {
    return this.prismaService.attentionHour.create({
      data: createAttentionHourDto
    });
  }

  addAttentionHourUser(addAttentionHourUser: AddAttHourUser) {
    return this.prismaService.attentionHourUser.create({
      data: addAttentionHourUser
    })
  }

  removeAttentionHourUser(addAttentionHourUser: AddAttHourUser) {
    return this.prismaService.attentionHourUser.delete({
      where: {
        userId_attentionHourId: {
          attentionHourId: addAttentionHourUser.attentionHourId,
          userId: addAttentionHourUser.userId
        }
      }
    })
  }

  findAll() {
    return this.prismaService.attentionHour.findMany();
  }

  findAllByOrganization(id: string) {
    return this.prismaService.attentionHour.findMany({
      where: {
        organizationId: id
      },
      include: {
        attentionHourUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              }
            }
          }
        }
      }
    }).then(attentioHours => {
      return attentioHours.map(ah => ({
        id: ah.id,
        days: ah.days,
        startTime: ah.startTime.toISOString(),
        endTime: ah.endTime.toISOString(),
        users: ah.attentionHourUsers.map(auh => auh.user)
      }))
    })
  }

  findOne(id: string) {
    return this.prismaService.attentionHour.findFirst({
      where: {
        id: id
      }
    });
  }

  update(id: string, updateAttentionHourDto: UpdateAttentionHourDto) {
    return this.prismaService.attentionHour.update({
      where: {
        id: id
      },
      data: updateAttentionHourDto
    });
  }

  remove(id: string) {
    return this.prismaService.attentionHour.delete({
      where: {
        id: id
      }
    });
  }

  async addMultipleAttentionHourUsers(addMultipleAttHourUsers: AddMultipleAttHourUsers) {
    const { userIds, attentionHourId } = addMultipleAttHourUsers;

    const createPromises = userIds.map(userId =>
      this.prismaService.attentionHourUser.create({
        data: {
          userId,
          attentionHourId
        }
      })
    );

    return Promise.all(createPromises);
  }

  async removeMultipleAttentionHourUsers(addMultipleAttHourUsers: AddMultipleAttHourUsers) {
    const { userIds, attentionHourId } = addMultipleAttHourUsers;

    const deletePromises = userIds.map(userId =>
      this.prismaService.attentionHourUser.delete({
        where: {
          userId_attentionHourId: {
            attentionHourId,
            userId
          }
        }
      })
    );

    return Promise.all(deletePromises);
  }

  async getUsersByAttentionHour(attentionHourId: string) {
    return this.prismaService.attentionHourUser.findMany({
      where: {
        attentionHourId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    });
  }
}
