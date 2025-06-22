import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AttentionHourService } from './attention-hour.service';
import { AddAttHourUser, AddMultipleAttHourUsers, CreateAttentionHourDto } from './dto/create-attention-hour.dto';
import { UpdateAttentionHourDto } from './dto/update-attention-hour.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('attention-hour')
export class AttentionHourController {
  constructor(private readonly attentionHourService: AttentionHourService) { }

  @Post()
  @ApiBody({ type: CreateAttentionHourDto })
  create(@Body() createAttentionHourDto: CreateAttentionHourDto) {
    return this.attentionHourService.create(createAttentionHourDto);
  }

  @Post('attHourUser')
  @ApiBody({ type: CreateAttentionHourDto })
  addAttHourUser(@Body() addAttHourUser: AddAttHourUser) {
    return this.attentionHourService.addAttentionHourUser(addAttHourUser);
  }

  @Delete('attHourUser')
  @ApiBody({ type: CreateAttentionHourDto })
  removeAttHourUser(@Body() addAttHourUser: AddAttHourUser) {
    return this.attentionHourService.removeAttentionHourUser(addAttHourUser);
  }

  @Post('attHourUsers')
  @ApiBody({ type: AddMultipleAttHourUsers })
  addMultipleAttHourUsers(@Body() addMultipleAttHourUsers: AddMultipleAttHourUsers) {
    return this.attentionHourService.addMultipleAttentionHourUsers(addMultipleAttHourUsers);
  }

  @Delete('attHourUsers')
  @ApiBody({ type: AddMultipleAttHourUsers })
  removeMultipleAttHourUsers(@Body() addMultipleAttHourUsers: AddMultipleAttHourUsers) {
    return this.attentionHourService.removeMultipleAttentionHourUsers(addMultipleAttHourUsers);
  }

  @Get()
  findAll() {
    return this.attentionHourService.findAll();
  }

  @Get('organization/:id')
  @ApiParam({ name: "id", description: "id de la organizacion" })
  findAllByOrganization(@Param('id') id: string) {
    return this.attentionHourService.findAllByOrganization(id)
  }

  @Get('users/:id')
  @ApiParam({ name: "id", description: "id del horario de atención" })
  getUsersByAttentionHour(@Param('id') id: string) {
    return this.attentionHourService.getUsersByAttentionHour(id);
  }

  @Get(':id')
  @ApiParam({ name: "id", description: "id del horario de atencion" })
  findOne(@Param('id') id: string) {
    return this.attentionHourService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttentionHourDto: UpdateAttentionHourDto) {
    return this.attentionHourService.update(id, updateAttentionHourDto);
  }

  @Delete(':id')
  @ApiParam({ name: "id", description: "id del horario de atencion" })
  remove(@Param('id') id: string) {
    return this.attentionHourService.remove(id);
  }
}
