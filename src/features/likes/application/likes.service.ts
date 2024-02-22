import { Injectable } from '@nestjs/common';
import { MyStatus } from '../domain/likes.entity';
import {
  LastLikedType,
  LikesDbType,
} from '../api/models/input/likes-input.model';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LastLikedOutputType } from '../api/models/likes-output-models';

@Injectable()
export class LikesService {
  constructor(protected likesRepository: LikesRepository) {}

  async isLikeExist(userId: string, _parentId: string): Promise<boolean> {
    const result = await this.likesRepository.isLikeExist(userId, _parentId);
    if (!result) return false;

    return true;
  }

  async addLike(
    userId: string,
    _parentId: string,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = new LikesDbType(
      userId,
      _parentId,
      new Date().toISOString(),
      _myStatus,
    );

    return await this.likesRepository.addLike(like);
  }
  async updateLike(
    userId: string,
    _parentId: string,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = await this.likesRepository.isLikeExist(userId, _parentId);
    if (like!.myStatus !== _myStatus) {
      return await this.likesRepository.updateLike(
        userId,
        _parentId,
        _myStatus,
      );
    }
    return true;
  }

  async lastLiked(userId: string, login: string, postId: string) {
    const addetdAt = new Date().toISOString();
    const lastLiked = new LastLikedType(addetdAt, userId, login, postId);
    const reaciton = await this.likesRepository.isItFirstLike(userId, postId);
    console.log(reaciton);
    if (!reaciton) {
      await this.likesRepository.lastLiked(lastLiked);
    }
  }
  async deleteLastLiked(userId: string, postId: string): Promise<boolean> {
    return await this.likesRepository.deleteLastLiked(userId, postId);
  }
  async getLastLikes(postId: string): Promise<LastLikedOutputType[]> {
    return await this.likesRepository.getLastLikes(postId);
  }
}
