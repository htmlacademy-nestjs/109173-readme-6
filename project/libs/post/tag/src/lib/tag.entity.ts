import { Entity, StorableEntity } from '@project/shared/core'
import { TagInterface } from './tag.interface';

export class TagEntity extends Entity implements TagInterface, StorableEntity<TagInterface>{
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;

  constructor(tag: TagInterface) {
    super();

    this.populate(tag);
  }

  public populate(tag: TagInterface) {
    this.id = tag.id;
    this.name = tag.name.toLowerCase();
    this.createdAt = tag.createdAt;
    this.updatedAt = tag.updatedAt;
  }

  public toPOJO() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
