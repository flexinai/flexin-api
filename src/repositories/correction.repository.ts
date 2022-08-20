import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {ReplyRepository} from '.';
import {DbDataSource} from '../datasources';
import {Correction, CorrectionNote, CorrectionRelations, Reply} from '../models';
import {CorrectionNoteRepository} from './correction-note.repository';

export class CorrectionRepository extends DefaultCrudRepository<
  Correction,
  typeof Correction.prototype.id,
  CorrectionRelations
> {
  public readonly correctionNote: BelongsToAccessor<CorrectionNote, typeof Correction.prototype.id>;
  public readonly reply: BelongsToAccessor<Reply, typeof Reply.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CorrectionNoteRepository')
    protected correctionNoteRepositoryGetter: Getter<CorrectionNoteRepository>,
    @repository.getter('ReplyRepository') protected replyRepositoryGetter: Getter<ReplyRepository>,
  ) {
    super(Correction, dataSource);
    this.correctionNote = this.createBelongsToAccessorFor('correctionNote', correctionNoteRepositoryGetter);
    this.registerInclusionResolver('correctionNote', this.correctionNote.inclusionResolver);
    this.reply = this.createBelongsToAccessorFor('reply', replyRepositoryGetter);
    this.registerInclusionResolver('reply', this.reply.inclusionResolver);
  }
}
