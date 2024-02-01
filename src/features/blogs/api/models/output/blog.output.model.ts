import { BlogsDocument } from '../../../domain/blogs.entity';

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

export const allBlogsOutputMapper = (
  blogs: BlogsOutputModel[],
  pagesCount: number,
  pageNumber: number,
  pageSize: number,
  countDocuments: number,
) => {
  const allBlogsOutput = {
    pagesCount,
    page: Number(pageNumber),
    pageSize: Number(pageSize),
    totalCount: countDocuments,
    items: blogs,
  };
  return allBlogsOutput;
};
export class AllBlogsOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsOutputModel[];
}
