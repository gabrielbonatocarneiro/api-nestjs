import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Helper } from './../helper';

import { Document } from './entities/document.entity';

import { DocumentDto } from './dto/document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PaginateDocumentDto } from './dto/paginate-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async findAll(
    userId: bigint,
    page: number,
    perPage: number,
  ): Promise<PaginateDocumentDto> {
    const [data, total] = await this.documentRepository.findAndCount({
      where: {
        user_id: Number(userId),
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      perPage,
      total: data.length,
      lastPage: Math.ceil(total / perPage),
      data,
    };
  }

  async findOne(userId: bigint, id: number): Promise<DocumentDto> {
    return await this.documentRepository.findOneOrFail(id, {
      where: {
        user_id: Number(userId),
      },
    });
  }

  async create(
    userId: bigint,
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    const document = this.documentRepository.create({
      user_id: userId,
      international: createDocumentDto.international,
      name: createDocumentDto.name,
      number: createDocumentDto.number,
      complement: createDocumentDto.complement || null,
    });

    return await this.documentRepository.save(document);
  }

  async update(
    userId: bigint,
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    const document = await this.findOne(userId, id);

    return await this.documentRepository.save({
      ...document,
      international: updateDocumentDto.international,
      name: updateDocumentDto.name || document.name,
      number: updateDocumentDto.number || document.number,
      complement: updateDocumentDto.complement
        ? updateDocumentDto.complement
        : null,
      updated_at: new Helper().now(),
    });
  }

  async remove(userId: bigint, id: number) {
    const document = await this.documentRepository.findOneOrFail(id, {
      where: {
        user_id: Number(userId),
      },
    });

    await this.documentRepository.remove(document);
  }
}
