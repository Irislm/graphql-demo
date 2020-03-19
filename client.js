`
query fun($characterId: String="1234", $withUserName: Boolean! = true) {
	hello
  hero {
    name
    appearsIn
  }
  mine: user(id: "123") {
    id
    name
  }
  other: user {
    id
    name
  }
  directiveUser: user {
    name @include(if: $withUserName)
  }
  droid {
    ...comparisonFields
    primaryFunction
  }
  human {
    ...comparisonFields
    totalCredits
  }
  character {
    name
    ...on Human{
      totalCredits
    }
    ...on Droid {
      primaryFunction
    }
  }
  search {
    ...on Droid {
      name
    }
    ...on Human {
      totalCredits
    }
  }
}
fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
    __typename
  }
  friendsConnection(id: $characterId) {
    name
  }
}
`