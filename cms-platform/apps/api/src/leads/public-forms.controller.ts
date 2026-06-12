import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadsService } from './leads.service.js';

class ContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;
}

class SubmitFormDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  idempotencyKey?: string;

  @ValidateNested()
  @Type(() => ContactDto)
  contact!: ContactDto;

  @IsObject()
  fields!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  source?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  website?: string;
}

@ApiTags('public forms')
@Controller('v1/public/sites/:siteKey/forms')
export class PublicFormsController {
  constructor(@Inject(LeadsService) private readonly leads: LeadsService) {}

  @Post(':formKey/submissions')
  submit(
    @Param('siteKey') siteKey: string,
    @Param('formKey') formKey: string,
    @Body() input: SubmitFormDto
  ) {
    return this.leads.submit(siteKey, formKey, input);
  }
}
