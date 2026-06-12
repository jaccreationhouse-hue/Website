import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator';

class ContentBlockDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/)
  type!: string;

  @IsObject()
  data!: Record<string, unknown>;
}

export class UpsertPageDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsIn(['draft', 'published', 'archived'])
  status!: 'draft' | 'published' | 'archived';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks!: ContentBlockDto[];

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;
}
