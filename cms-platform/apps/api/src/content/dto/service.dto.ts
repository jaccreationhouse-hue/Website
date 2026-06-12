import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class UpsertServiceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(180)
  subtitle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  tagline?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1200)
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  capabilities!: string[];

  @IsBoolean()
  featured!: boolean;

  @IsIn(['draft', 'published', 'archived'])
  status!: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
