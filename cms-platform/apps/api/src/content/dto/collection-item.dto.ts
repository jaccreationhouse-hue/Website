import { IsIn, IsInt, IsObject, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpsertCollectionItemDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsIn(['draft', 'published', 'archived'])
  status!: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsObject()
  data!: Record<string, unknown>;
}
