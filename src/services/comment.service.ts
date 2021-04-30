import Comment from 'models/comments.model';
import CreateCommentDto from 'dtos/comments.dtos';
import User from '../models/users.model';

class CommentService {
  public model = Comment;

  public async list(listingId = null): Promise<Comment[]> {
    const cond = listingId
      ? {
          where: {
            listingId: listingId,
          },
        }
      : undefined;

    const data: Comment[] = await this.model.findAll(cond);
    return data;
  }

  public async create(data: CreateCommentDto, user: User, listingId: number): Promise<Comment> {
    return await this.model.create({ ...data, userId: user.id, listingId: listingId });
  }
}

export default CommentService;
