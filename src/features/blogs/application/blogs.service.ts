import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogsDocument } from '../domain/blogs.entity';
import { Types } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import { BlogsQueryParams } from '../api/models/query/query.params';
import { AllBlogsOutputModel } from '../api/models/output/blog.output.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { PostCreateModel } from 'src/features/posts/api/models/input/create-post.input.model';
import {
  ExtendedLikesInfo,
  Posts,
  PostsDocument,
} from 'src/features/posts/domain/posts.entity';
import { PostsRepository } from 'src/features/posts/infrastructure/posts.repository';
import { PostOutputModel } from 'src/features/posts/api/models/output/post-output.model';
import { MyStatus } from '../../../common/enum-types/enumTypes';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createBlog(blogsCreateModel: BlogsCreateModel): Promise<BlogsDocument> {
    const createdAt = new Date();
    const id = new Types.ObjectId().toString();
    const newBlog = {
      id: id,
      name: blogsCreateModel.name,
      description: blogsCreateModel.description,
      websiteUrl: blogsCreateModel.websiteUrl,
      createdAt: createdAt.toISOString(),
      isMembership: false,
    };
    return await this.blogsRepository.createBlog(newBlog);
  }

  async findAllBlogs(
    blogsQueryParams: BlogsQueryParams,
  ): Promise<AllBlogsOutputModel> {
    const searchNameTerm = blogsQueryParams.searchNameTerm ?? '';
    const sortBy = blogsQueryParams.sortBy ?? 'createdAt';
    const sortDirection = blogsQueryParams.sortDirection ?? 'desc';
    const pageNumber = blogsQueryParams.pageNumber ?? 1;
    const pageSize = blogsQueryParams.pageSize ?? 10;

    const query = { name: new RegExp(searchNameTerm, 'i') };
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.blogsRepository.countDocuments(query);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allBlogs = await this.blogsRepository.getAllBlogs(
      query,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationAllblogs = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allBlogs,
    };

    return presentationAllblogs;
  }

  async updateBlog(
    id: string,
    blogsUpdateModel: BlogsCreateModel,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  }

  async deleteBLog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id);
  }

  async createPostForSpecificBlog(
    postCreateModel: PostCreateModel,
    blogId: string,
  ): Promise<PostsDocument | null> {
    const isBlogExist =
      await this.blogsQueryRepository.getCurrentBlogById(blogId);
    if (!isBlogExist) {
      return null;
    }

    const { title, shortDescription, content } = postCreateModel;
    const createdAt = new Date().toISOString();
    const id = new Types.ObjectId().toString();

    const extendedLikesInfo = new ExtendedLikesInfo();
    extendedLikesInfo.likesCount = 0;
    extendedLikesInfo.dislikesCount = 0;
    extendedLikesInfo.myStatus = MyStatus.None;
    extendedLikesInfo.newestLikes = [];

    // const extendedLikesInfo = {
    //   likesCount: 0,
    //   dislikesCount: 0,
    //   myStatus: MyStatus.None,
    //   newestLikes: [],
    // };
    const newPost = new Posts();
    newPost.id = id;
    newPost.title = title;
    newPost.shortDescription = shortDescription;
    newPost.content = content;
    newPost.blogId = isBlogExist.id;
    newPost.blogName = isBlogExist.name;
    newPost.createdAt = createdAt;
    // newPost.extendedLikesInfo = extendedLikesInfo;

    // const newPost = {
    //   id,
    //   title,
    //   shortDescription,
    //   content,
    //   blogId: isBlogExist.id,
    //   blogName: isBlogExist.name,
    //   createdAt,
    // };
    return this.postsRepository.createPost(newPost);
  }
}
