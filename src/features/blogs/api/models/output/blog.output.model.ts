import { BlogsDocument } from 'src/features/blogs/domain/blogs.entity';

export class BlogsOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export const BlogsOutputMapper = (blog: BlogsDocument): BlogsOutputModel => {
  const outputModel = new BlogsOutputModel();
  outputModel.id = blog.id;
  outputModel.name = blog.name;
  outputModel.description = blog.description;
  outputModel.websiteUrl = blog.websiteUrl;
  outputModel.createdAt = blog.createdAt;
  outputModel.isMembership = blog.isMembership;
  return outputModel;
};
