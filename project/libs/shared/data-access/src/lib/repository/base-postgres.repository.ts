import { PrismaClientService } from '@project/blog/models';
import { Entity, StorableEntity, EntityFactory } from '@project/shared/core';
import { Repository } from './repository.interface';

export abstract class BasePostgresRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
  DocumentType = ReturnType<T['toPOJO']>
> implements Repository<T> {

  constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly dbClient: PrismaClientService,
  ) {}

  protected createEntityFromDocument(document: DocumentType): T | null {
    if (! document) {
      return null;
    }

    return this.entityFactory.create(document as ReturnType<T['toPOJO']>);
  }

  public async findById(id: T['id']): Promise<T | null> {
    throw new Error('Not implemented');
  }

  public async findByIds(ids: T['id'][]): Promise<T[] | null> {
    throw new Error('Not implemented');
  }

  public async create(id: T): Promise<T> {
    throw new Error('Not implemented');
  }

  public async updateById(id: T['id'], updatedFields: Partial<T>): Promise<T | void> {
    throw new Error('Not implemented');
  }

  public async deleteById(id: T['id']): Promise<void> {
    throw new Error('Not implemented');
  }
}
