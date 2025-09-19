const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } = require('graphql');
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

// Comment Type
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    author: { type: GraphQLString },
    thread: { type: GraphQLID },
    createdAt: { type: GraphQLString }
  })
});

// Thread Type
const ThreadType = new GraphQLObjectType({
  name: 'Thread',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    comments: { 
      type: new GraphQLList(CommentType),
      resolve: async (thread) => {
        return await Comment.find({ thread: thread.id }).populate('author', 'name');
      }
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    threads: {
      type: new GraphQLList(ThreadType),
      resolve: () => Thread.find().populate('author', 'name email')
    },
    thread: {
      type: ThreadType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => Thread.findById(args.id).populate('author', 'name email')
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
