var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  #查询入口
  type Query {
    hello: String
    hero: Hero
    user(id: String): User
    human: Human
    droid: Droid
    character: Character
    search: SearchResult
  }
  type Mutation {
    createReview(review: ReviewInput): Result
  }

  #对象类型和字段
  type Hero {
    #标量类型
    name: String!
    #列表和非空
    appearsIn: [Episode!]!
  }
  #参数
  type User {
    id: String
    name: String
  }
  #接口
  interface Character {
    id: ID
    name: String
    friends: [Character]
    appearsIn: [Episode]
    friendsConnection(id: String): [User]
  }
  #接口实现与特定字段
  type Human implements Character {
    id: ID
    name: String
    friends: [Character]
    appearsIn: [Episode]
    friendsConnection(id: String): [User]
    #特定字段
    totalCredits: Int
  }
  type Droid implements Character {
    id: ID
    name: String
    friends: [Character]
    appearsIn: [Episode]
    friendsConnection(id: String): [User]
    primaryFunction: String
  }
  #枚举类型
  enum Episode {
    SHANGHAI
    BEIJING
    GUANGZHOU
  }
  #联合类型
  union SearchResult = Human | Droid
  #输入类型
  input ReviewInput {
    stars: Int!
    comments: String
  }
  type Result {
    status: String
  }
`);

// root 提供所有 API 入口端点相应的解析器函数
var root = {
  // 字段
  hello: () => {
    return 'Hello world!';
  },
  // 对象类型
  hero: () => {
      return {
          name: 'irismmr',
          appearsIn: ['SHANGHAI']
      };
  },
  // 参数
  user: (args) => {
    const {id} = args;
    if (id == '123') {
      return {
        name: 'Ming',
        id: '123',
      }
    } else {
      return {
        name: 'Graph',
        id: '123456'
      }
    }
  },
  // 接口实现和特定字段
  human: () => {
    return {
      id: 123,
      name: 'shanghai ren ming',
      totalCredits: 10000,
      friendsConnection: (args) => {
        const {id } = args;
        if (id === "1234") {
          return [{
            id: 1234,
            name: 'beijing ren ming',
            totalCredits: 10000,
            // 不带这个字段 会报错abstract-type-n-must-resolve-to-an-object-type-at-runtime
            __typename: 'Human'
          }];
        }
        return null
      }
    }
  },
  droid: () => {
    return {
      id: 223,
      name: 'guangzhou ren ming',
      primaryFunction: 'Sa!',
      friendsConnection: [],
    }
  },
  character: () => {
    return {
      name: 'guangzhou ren ming',
      primaryFunction: 'Sa!',
      // 不带这个字段 会报错abstract-type-n-must-resolve-to-an-object-type-at-runtime
      __typename: 'Droid'
    }
  },
  search: () => {
    return {
      name: 'guangzhou ren ming',
      primaryFunction: 'Sa!',
      // 不带这个字段 会报错abstract-type-n-must-resolve-to-an-object-type-at-runtime
      __typename: 'Droid'
    }
  },
  createReview: () => {
    return {
      status: 'success'
    };
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');